## Description

Stone customer api

# 🧰 Installation

## Prerequisites

- [`Node`](https://nodejs.org/en/download) >= 14.17.5
- [`yarn`](https://yarnpkg.com/cli/install)
- [`Docker`](https://docs.docker.com/get-docker)

Install yarn packages before continue

```bash
$ yarn
```

Ask other developers to share `.env`. For security reasons this file is not versioned.

Whenever a new environment variable is added, it must be also added to the `.example.env` file to keep everything up to date.

## Setting up Docker

- This is will make a new Redis running in the standard port `6379`.
- This is will make a new redis-commander running in port `8081`.

```bash
make compose-local
```

# ⌨ Development

## ⚙ Running the app

```bash
# development
yarn start:dev
```

Observation: Api will run on the port set in `$APP_PORT` in `.env`.

## 🎮 Playground

`http://localhost:$APP_PORT/swagger` to access swagger playground.

## 🧪 Running tests

```bash
# unit tests
yarn test

# unit tests with coverage
yarn test:cov

# e2e tests
yarn test:e2e
```

After executing `yarn test:cov`, the `coverage` folder will be generated with coverage details.

## 📏 Lint

Linting codebase

```bash
# issues are automatically fixed
yarn lint
```

# 📦 Building

Before building application to production, make sure environment variables are applied correctly.

Building for production

```bash
make compose
```

# ✅ TODO

[ ] Add CI  
[ ] Improve docker for production  
[ ] Add integration tests to redis  
[ ] Add integration tests to keycloak  
[ ] Add redis transactions  
[ ] Standardize error messages  
[ ] Add SUT to avoid some redundant stuffs in tests  
[ ] Add pt-BR README  
[ ] Add application logs  
[ ] Add stress tests  
[ ] Add husky pre-push  
[ ] Disable swagger on production
