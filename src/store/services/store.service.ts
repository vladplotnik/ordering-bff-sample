import {
    Injectable,
    Inject,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import swell = require('swell-node');
import { createClient } from '@sanity/client';
import { Config, LoggerService } from '../../common';
import { AccountRegistrationData, Promotion, UserAccount } from '../models';

@Injectable()
export class StoreService {
    private readonly swellClient;
    private readonly sanityClient;

    public constructor(
        @Inject('CONFIG') private readonly config: Config,
        private readonly logger: LoggerService,
    ) {
        this.swellClient = swell.createClient(
            this.config.SWELL_STORE_ID,
            this.config.SWELL_SECRET_KEY,
        );
        this.sanityClient = createClient({
            projectId: this.config.SANITY_PROJECT_ID,
            dataset: this.config.SANITY_DATASET,
            token: this.config.SANITY_API_TOKEN,
            apiVersion: this.config.SANITY_API_VERSION,
            useCdn: false,
        });
    }

    public async registerAccount(userAccount: AccountRegistrationData): Promise<UserAccount> {
        const swellAccountPayload = {
            first_name: userAccount.firstName,
            last_name: userAccount.lastName,
            email: userAccount.email,
            email_optin: userAccount.emailOptin,
            password: userAccount.password,
            phone: userAccount.phone,
            metadata: {
                prefersSmsNotification: userAccount.acceptsPhoneTerms,
                prefersPushNotification: userAccount.prefersPushNotification ?? true,
                prefersEmailNotification: userAccount.prefersEmailNotification ?? true,
            },
        };

        try {
            // register a new user account
            return await this.swellClient.post('/accounts', swellAccountPayload);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Error creating account');
        }
    }

    public async updateProduct(id: string) {
        try {
            const [productResponse, variantsResponse] = await Promise.all([
                swell.get(`/products/${id}`),
                swell.get(`/products:variants?where[parent_id]=${id}`),
            ]);

            const product = productResponse;
            const variants = variantsResponse.results;

            if (!product) {
                this.logger.error(`No product found with ID ${id}`);

                return new Response(
                    JSON.stringify({
                        error: 'An internal server error has occured.',
                    }),
                    { status: 500 },
                );
            }

            // Patch Product
            const swellProduct = {
                ...product,
                _type: 'swellProduct',
                _id: id,
                deleted: false,
            };

            let tx = this.sanityClient.transaction();

            tx = tx.createIfNotExists(swellProduct);
            tx = tx.patch(swellProduct._id, (p) => p.set(swellProduct));

            // Patch Variants
            const swellProductVariants = variants.map((variant) => ({
                ...variant,
                _type: 'swellProductVariant',
                _id: variant.id,
            }));

            // Create Variant
            swellProductVariants.forEach((variant) => {
                tx = tx.createIfNotExists(variant);
                tx = tx.patch(variant._id, (p) => p.set(variant));
            });

            this.logger.info(
                `Updating/patching Variants ${variants.map((v) => v.id).join(', ')} in Sanity`,
            );

            // Include variants on product document
            tx = tx.patch(swellProduct._id, (p) => {
                return p.set({
                    variants: variants.map((variant) => ({
                        _type: 'reference',
                        _ref: variant.id,
                        _key: variant.id,
                    })),
                });
            });

            this.logger.info(`Adding variant references to ${id} in Sanity`);

            const result = await tx.commit();

            return result;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Error updating product');
        }
    }

    public async deleteProduct(id: string) {
        try {
            const product = {
                _type: 'swellProduct',
                _id: id,
                deleted: true,
            };

            let tx = this.sanityClient.transaction();

            tx = tx.createIfNotExists(product);
            tx = tx.patch(product._id, (p) => p.set(product));

            this.logger.info(`Marking product ${id} as deleted`);

            const result = await tx.commit();

            return result;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Error deleting product');
        }
    }

    public async getPromotion(id: string): Promise<Promotion> {
        try {
            const promotion = await swell.get(`/promotions/${id}`);

            if (!promotion) {
                throw new NotFoundException(`Promotion with id ${id} not found.`);
            }

            return promotion;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(`Error retrieving promotion with Id ${id}`);
        }
    }
}
