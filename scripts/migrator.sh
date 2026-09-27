#!/bin/sh

npx prisma migrate deploy --config ./auth-database/prisma.config.ts
