import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
    LocationInventory,
    LocationInventoryItem,
    LocationStatusResponse,
    PickupItem,
    TheoreticalEta,
} from '../models';
import { LocationService } from '../services';

@Controller('locations')
@ApiTags('location')
export class LocationController {
    public constructor(private readonly locationService: LocationService) {}

    @Get('/:locationId/inventory')
    @ApiOperation({ summary: 'Get location inventory' })
    @ApiResponse({ status: HttpStatus.OK, type: LocationInventory })
    public async getInventory(@Param('locationId') locationId: string): Promise<LocationInventory> {
        return this.locationService.getLocationInventory(locationId);
    }

    @Get('/:locationId/inventory-item/:sku')
    @ApiOperation({ summary: 'Get location inventory item' })
    @ApiResponse({ status: HttpStatus.OK, type: LocationInventoryItem })
    public async getInventoryItem(
        @Param('locationId') locationId: string,
        @Param('sku') sku: string,
    ): Promise<LocationInventoryItem> {
        return this.locationService.getLocationInventoryItem(locationId, sku);
    }

    @Get('/:locationId/status')
    @ApiOperation({ summary: 'Get location status' })
    @ApiResponse({ status: HttpStatus.OK, type: LocationStatusResponse })
    public async getStatus(
        @Param('locationId') locationId: string,
    ): Promise<LocationStatusResponse> {
        return this.locationService.getLocationStatus(locationId);
    }

    @Post('/:locationId/theoretical-eta')
    @ApiBody({
        isArray: true,
        type: PickupItem,
    })
    @ApiOperation({ summary: 'Get theoretical order ETA' })
    @ApiResponse({ status: HttpStatus.OK, type: TheoreticalEta })
    public async getTheoreticalEta(
        @Param('locationId') locationId: string,
        @Body() items: PickupItem[],
    ): Promise<TheoreticalEta> {
        return this.locationService.getTheoreticalPickupEta(locationId, items);
    }
}
