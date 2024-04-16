import { Module } from '@nestjs/common';
import { AccountController, ProductController, PromotionController } from './controllers';
import { StoreService } from './services';

@Module({
    controllers: [ProductController, AccountController, PromotionController],
    providers: [StoreService],
})
export class StoreModule {}
