# Ordering Backend for Frontend

An example of BFF implementation using [NestJS 10](https://nestjs.com/). It's a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript and is built with TypeScript.

- Fast HTTP server with [Fastify](https://fastify.dev/) (can handle a large number of concurrent requests up to 30K req/sec)
- Designed for Docker environments (includes Dockerfile and environment variables)
- Swagger documentation, Winston logger, security guard, etc

## System Requirements

- Node 20
- PNPM
- Nest CLI

## 1. Getting started

### 1.1 Project configuration

Start by installing project dependencies.

```bash
pnpm install
```

Once the dependencies are installed, you can now configure your project by creating a new `.env` file containing the environment variables used for development.

```bash
copy .env.example .env
```

For the BFF application to interact effectively with various services, it is essential to configure environment variables.

- `API Gateway URL`: Set the base URL for routing requests.
- `Swell`: Include your store ID and secret key for authentication.
- `Sanity`: Provide API version, dataset, project ID, and an API token.
- `Firebase Project ID`: Provide project ID.

For a standard development configuration, you can leave the default values for `API_PORT`, `API_PREFIX` and `SWAGGER_ENABLE`.

### 1.2 Launch

You are now ready to launch the BFF application using the command below.

```bash
pnpm run start
```

You can head to `http://localhost:5000/swagger` and see your API Swagger docs. The example location API is located at the `http://localhost:5000/api/locations` endpoint.

## 2. Project structure

NestJS encourages dividing the application into modules which help in organizing the application by breaking it into logical chunks. Each module corresponds to a feature or closely related set of features. Here’s how a BFF application can be structured:

```bash
src/
├── common/  # The common module contains pipes, services and providers that can be reused across different modules
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

Organizing a NestJS application in this way ensures that it is modular and maintainable. Each module has everything it needs to operate independently, which simplifies the development, testing, and debugging processes.

## 3. Default NPM commands

The NPM commands below can be used to quickly run, build and test the application.

```bash
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

## 4. Security

A key feature of BFF security is the use of AppCheck tokens to verify client applications before granting access to its resources. This ensures that only requests from trusted client apps are processed, reducing the risk of malicious attacks. The BFF uses a NestJS [Guard](https://docs.nestjs.com/guards) to intercept all incoming requests and validate the AppCheck tokens. The AppCheck guard is configured globally to ensure that no endpoint can be accessed without passing a token. Each request from the client app to the BFF must include the AppCheck token in the request headers. See the code example below.

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

## 5. Testing

Unit tests can be run using the following command:

```bash
pnpm run test
```

The project uses [Jest](https://jestjs.io/) to execute all tests within the project. The unit tests are placed alongside the modules they verify and have a `.spec.ts` extension.
