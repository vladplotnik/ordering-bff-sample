import { Module } from '@nestjs/common';

import { StoreModule } from './store/store.module';
import { CommonModule } from './common';
import { LocationModule } from './location/location.module';

@Module({
    imports: [CommonModule, LocationModule, StoreModule],
})
export class ApplicationModule {}
