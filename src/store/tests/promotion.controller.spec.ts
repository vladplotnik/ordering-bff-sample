import { Test, TestingModule } from '@nestjs/testing';
import { PromotionController } from '../controllers';

describe('PromotionController', () => {
    let controller: PromotionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PromotionController],
        }).compile();

        controller = module.get<PromotionController>(PromotionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
