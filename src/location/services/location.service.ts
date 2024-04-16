import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';

import { AppCheckContext, Config, LoggerService } from '../../common';
import {
    LocationInventory,
    LocationInventoryItem,
    LocationStatusResponse,
    PickupItem,
    TheoreticalEta,
} from '../models';

@Injectable()
export class LocationService {
    public constructor(
        @Inject('CONFIG') private readonly config: Config,
        private readonly logger: LoggerService,
        private appCheckContext: AppCheckContext,
    ) {}

    public async getLocationInventory(locationId: string): Promise<LocationInventory> {
        const response = await fetch(
            `${this.config.API_GATEWAY_BASE_URL}/oms/restaurants/${locationId}/inventory`,
            {
                headers: {
                    'x-client-name': this.appCheckContext.clientName,
                    'x-recaptcha-token': this.appCheckContext.token,
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache',
            },
        );

        if (!response.ok) {
            this.logger.error(`Error fetching inventory with location Id ${locationId}`);
            throw new InternalServerErrorException('Error fetching inventory', locationId);
        }

        return response.json();
    }

    public async getLocationInventoryItem(
        locationId: string,
        sku: string,
    ): Promise<LocationInventoryItem> {
        const response = await fetch(
            `${this.config.API_GATEWAY_BASE_URL}/oms/restaurants/${locationId}/inventory/${sku}`,
            {
                headers: {
                    'x-client-name': this.appCheckContext.clientName,
                    'x-recaptcha-token': this.appCheckContext.token,
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache',
            },
        );

        if (!response.ok) {
            this.logger.error(
                `Error fetching inventory item ${sku} with location Id ${locationId}`,
            );
            throw new InternalServerErrorException('Error fetching inventory item', sku);
        }

        return response.json();
    }

    public async getLocationStatus(locationId: string): Promise<LocationStatusResponse> {
        const response = await fetch(
            `${this.config.API_GATEWAY_BASE_URL}/oms/restaurants/${locationId}/status`,
            {
                headers: {
                    'x-client-name': this.appCheckContext.clientName,
                    'x-recaptcha-token': this.appCheckContext.token,
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache',
            },
        );

        if (!response.ok) {
            this.logger.error(`Error fetching location status with location Id ${locationId}`);
            throw new InternalServerErrorException('Error fetching location status', locationId);
        }

        return response.json();
    }

    public async getTheoreticalPickupEta(
        locationId: string,
        items: PickupItem[],
    ): Promise<TheoreticalEta> {
        const response = await fetch(
            `${this.config.API_GATEWAY_BASE_URL}/oms/restaurants/${locationId}/theoretical-eta`,
            {
                method: 'POST',
                headers: {
                    'x-client-name': this.appCheckContext.clientName,
                    'x-recaptcha-token': this.appCheckContext.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items }),
                cache: 'no-cache',
            },
        );

        if (!response.ok) {
            this.logger.error(
                `Error fetching theoretical pickup eta with location Id ${locationId}`,
            );
            throw new InternalServerErrorException(
                'Error fetching theoretical pickup eta',
                locationId,
            );
        }

        return response.json();
    }
}
