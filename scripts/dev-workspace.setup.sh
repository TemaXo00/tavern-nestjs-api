#!/bin/bash
set -e

cd "$(dirname "$(realpath "$0")")" || exit 1

if [ "$(basename "$PWD")" = "scripts" ]; then
  cd ..
fi

docker build -f docker-files/Db-Migrator.Dockerfile -t tavern/migrator:latest .

[ -f .env ] || cp .env.example .env
[ -f app/.env ] || cp app/.env.example app/.env
[ -d .bruno/environments ] || cp -r .bruno/environments-example .bruno/environments

cd app
npm ci
npm run nx:sync
npm run auth-db:generate
