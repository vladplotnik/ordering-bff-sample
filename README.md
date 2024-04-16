# Ordering Backend for Frontend

## 1. Getting started

### 1.1 Project configuration

Configure your project by creating a new `.env` file containing the environment variables used for development. The `SWAGGER_ENABLE` rule allows you to control the Swagger documentation module for NestJS.

### 1.2 Launch

You are now ready to launch the BFF application using the command below.

```sh
# Install dependencies
pnpm install

# Run the application
pnpm run start
```

You can now head to `http://localhost:3000/docs` and see your API Swagger docs. The example location API is located at the `http://localhost:3000/api/v1/locations` endpoint.

## 2. Project structure

This BFF application uses the following directory structure.

```sh
src/
├── common/  # The common module contains pipes, services and providers used in the whole application
│   ├── flows/
│   │   └── log.interceptor.ts
│   ├── models/
│   │   ├── config.ts
│   ├── providers/
│   │   └── config.provider.ts
│   │   └── logger.service.ts
│   ├── security/
│   │   └── appcheck.context.ts
│   │   └── appcheck.guard.ts
│   ├── common.module.ts
├── location/  # A module that manages location resources, such as inventory, status, pickup time, etc
│   ├── controllers/
│   │   └── location.controller.ts
│   ├── models/
│   │   ├── location-inventory.dto.ts
│   │   ├── location-status.dto.ts
│   │   ├── pickup-item.dto.ts
│   │   ├── theoretical-eta.dto.ts
│   ├── services/
│   │   └── location.service.ts
│   └── tests/
│   ├── location.module.ts
├── store/  # A module that manages store resources, such as user accounts, products, promotions, etc
│   ├── controllers/
│   │   └── account.controller.ts
│   │   └── product.controller.ts
│   │   └── promotion.controller.ts
│   ├── models/
│   │   ├── account-registration.dto.ts
│   │   ├── promotion.dto.ts
│   │   ├── user-account.dto.ts
│   ├── services/
│   │   └── store.service.ts
│   └── tests/
│   ├── store.module.ts
├── app.module.ts
└── main.ts
```

## 3. Default NPM commands

The NPM commands below can be used to quickly run, build and test the application.

```sh
# Run the application
pnpm run start

# Run the application in watch mode
pnpm run start:dev

# Run the application in production mode
pnpm run start:prod

# Compiles the application into output folder
pnpm run build

# Run unit tests
pnpm run test

# Lint the project files
pnpm run lint
```

## 3. Example of usage

Below you can find an example of BFF API invocation.

```ts
const token = await getAppCheckToken();
const response = await fetch(
  `http://localhost:5000/api/locations/${locationId}/inventory`,
  {
    headers: {
      'x-client-name': 'web',
      'x-appcheck-token': token ?? '',
      'Content-Type': 'application/json',
    },
    'no-cache',
  },
);
```
