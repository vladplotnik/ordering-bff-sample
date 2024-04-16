import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Promotion } from '../models';
import { StoreService } from '../services';

@Controller('promotions')
@ApiTags('promotion')
export class PromotionController {
    public constructor(private readonly storeService: StoreService) {}

    @Get('/:id')
    @ApiOperation({ summary: 'Get promotion' })
    @ApiResponse({ status: HttpStatus.OK, type: Promotion })
    public async getPromotion(@Param('id') id: string): Promise<Promotion> {
        return this.storeService.getPromotion(id);
    }
}
