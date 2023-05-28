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

## Setting up Redis

- This is will make a new Redis running in the standard port `6379`.

```bash
docker-compose up -d
```

After executing `docker-compose up` access http://localhost:8081 to access `redis-commandaer` UI.

# ⌨ Development

## ⚙ Running the app

```bash
# development
yarn start:dev
```

## 🎮 Playground

`http://localhost:$APP_PORT/swagger` to access swagger playground.

Observartion: You must change `$APP_PORT` for the port to be used in your environment.

## 🧪 Running tests

```bash
# unit tests
yarn test

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
yarn build
```

Running on production

```bash
yarn start:prod
```

# ✅ TODO

[ ] Add docker
[ ] Standardize error messages
[ ] Lock nodejs version
[ ] Add pt-BR README
[ ] Add application logs
[ ] Add stress tests
[ ] Add husky pre-push
