export interface Config {
    readonly API_PORT: number;
    readonly API_PREFIX: string;
    readonly SWAGGER_ENABLE: number;

    readonly API_GATEWAY_BASE_URL: string;

    readonly SWELL_STORE_ID: string;
    readonly SWELL_SECRET_KEY: string;

    readonly SANITY_API_VERSION: string;
    readonly SANITY_DATASET: string;
    readonly SANITY_PROJECT_ID: string;
    readonly SANITY_API_TOKEN: string;

    readonly FIREBASE_API_KEY: string;
    readonly FIREBASE_APP_ID: string;
    readonly FIREBASE_AUTH_DOMAIN: string;
    readonly FIREBASE_MEASUREMENT_ID: string;
    readonly FIREBASE_MESSAGING_SENDER_ID: string;
    readonly FIREBASE_PROJECT_ID: string;
    readonly FIREBASE_STORAGE_BUCKET: string;
}
