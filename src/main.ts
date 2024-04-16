import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppOptions, initializeApp } from 'firebase-admin/app';

import { ApplicationModule } from './app.module';
import { AppCheckContext, AppCheckGuard, CommonModule, LogInterceptor } from './common';

/**
 * These are API defaults that can be changed using environment variables
 */
const API_DEFAULT_PORT = 5000;
const API_DEFAULT_PREFIX = '/api/';

/**
 * The defaults below are dedicated to Swagger configuration
 */
const SWAGGER_TITLE = 'Ordering BFF API';
const SWAGGER_DESCRIPTION = 'API used for ordering by client apps';
const SWAGGER_PREFIX = '/swagger';

/**
 * Register a Swagger module in the NestJS application
 */
function createSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .addGlobalParameters(
            {
                in: 'header',
                required: true,
                name: 'x-client-name',
            },
            {
                in: 'header',
                required: true,
                name: 'x-appcheck-token',
            },
        )
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

/**
 * Enable AppCheck token validation
 */
function enableAppCheck(app: INestApplication) {
    initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    } as AppOptions);

    const appCheckContext = app.get(AppCheckContext);
    app.useGlobalGuards(new AppCheckGuard(appCheckContext));
}

/**
 * Build & bootstrap the NestJS API. This method registers the application module and
 * essential components such as logger, authentication, etc.
 */
async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        ApplicationModule,
        new FastifyAdapter(),
    );

    app.enableCors();

    app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);

    if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === '1') {
        createSwagger(app);
    }

    const logInterceptor = app.select(CommonModule).get(LogInterceptor);
    app.useGlobalInterceptors(logInterceptor);

    enableAppCheck(app);

    await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}

bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);

    const defaultExitCode = 1;
    process.exit(defaultExitCode);
});
