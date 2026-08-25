# NestJS Project Example

![NestJS](https://img.shields.io/badge/NestJS-10-red)
![NX](https://img.shields.io/badge/NX-20-blue)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

## Features

- Ready for usage Tasks API for example
- Set up docker images with latest versions
- Automatically scripts for docker build and push images
- Custom NestJS Bootstrap's for microservices and API Gateway
- Setup infrastructure (ignore files, prettier, eslint)
- Using NX monorepo for code organization

## Variables
In API, you should use ENV variables with your global scope. Example:

```text
# Scope EXAMPLE
APPS_GLOBAL_SCOPE=EXAMPLE
EXAMPLE_DEV_MODE=true

# Scope TEMAXO
APPS_GLOBAL_SCOPE=TEMAXO

TEMAXO_GATEWAY_PORT=3000
```

All default ENV variables you can see in default .env files

## Usage

1. Clone repo
2. Copy .env.example and rename to .env in root folder and 'app' folder
3. Setup ENV Variables
4. Install NPM dependencies
5. Modify code
6. Run docker containers
7. Run application

## Terminal example

```bash
# 1. Clone repository and enter to it
git clone https://github.com/TemaXo00/nestjs-repo-example.git
cd nestjs-repo-example

# 2. Copy .env.example
cp .env.example .env
cp app/.env.example app/.env

# 3. Setup variables
nano .env
nano app/.env

# 4. Install npm deps
cd app
npm i

# 5. Modify code

# 6. Run docker
docker compose up --build -d

# 7. Run apps
npm run all:dev
```

## Useful commands

### Build and push in Docker registry

```bash
# DEV Gateway
./scripts/dev-gateway.sh

# DEV Microservices
./scripts/dev-microservices tasks
```

### Fix ESLint

```bash
cd app
npm run all:lint-fix
```

### NX Useful commands
```bash
# Graph of deps
npm run nx:graph

# Clean cache
npm run nx:clean

# Sync
npm run nx:sync
```