import * as Joi from 'joi';

import { Config } from '../models';

export const configProvider = {
    provide: 'CONFIG',
    useFactory: (): Config => {
        const env = process.env;
        const validationSchema = Joi.object<Config>().unknown().keys({
            API_PORT: Joi.number().required(),
            API_PREFIX: Joi.string().required(),
            SWAGGER_ENABLE: Joi.number().required(),
            SWELL_STORE_ID: Joi.string().required(),
            SWELL_SECRET_KEY: Joi.string().required(),
            SANITY_API_VERSION: Joi.string().required(),
            SANITY_DATASET: Joi.string().required(),
            SANITY_PROJECT_ID: Joi.string().required(),
            SANITY_API_TOKEN: Joi.string().required(),
            FIREBASE_API_KEY: Joi.string().required(),
            FIREBASE_APP_ID: Joi.string().required(),
            FIREBASE_AUTH_DOMAIN: Joi.string().required(),
            FIREBASE_MEASUREMENT_ID: Joi.string().required(),
            FIREBASE_MESSAGING_SENDER_ID: Joi.string().required(),
            FIREBASE_PROJECT_ID: Joi.string().required(),
            FIREBASE_STORAGE_BUCKET: Joi.string().required(),
        });

        const result = validationSchema.validate(env);
        if (result.error) {
            throw new Error(`Configuration not valid: ${result.error.message}`);
        }

        return result.value;
    },
};
