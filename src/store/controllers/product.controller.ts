import { Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { StoreService } from '../services';

@Controller('products')
@ApiTags('product')
export class ProductController {
    public constructor(private readonly storeService: StoreService) {}

    @Post('update')
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: HttpStatus.OK })
    public async updateProduct(@Param('id') id: string) {
        return this.storeService.updateProduct(id);
    }

    @Post('delete')
    @ApiOperation({ summary: 'Delete product' })
    @ApiResponse({ status: HttpStatus.OK })
    public async deleteProduct(@Param('id') id: string) {
        return this.storeService.deleteProduct(id);
    }
}
