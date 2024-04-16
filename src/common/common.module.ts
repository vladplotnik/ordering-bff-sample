import { Global, Module } from '@nestjs/common';
import { LogInterceptor } from './flows';
import { configProvider, LoggerService } from './providers';
import { AppCheckContext } from './security';

@Global()
@Module({
    providers: [configProvider, AppCheckContext, LoggerService, LogInterceptor],
    exports: [configProvider, AppCheckContext, LoggerService, LogInterceptor],
})
export class CommonModule {}
