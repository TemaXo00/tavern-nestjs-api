FROM node:26.3-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

COPY services/auth ./services/auth
COPY proto/auth.proto ./proto/auth.proto
COPY proto/auth ./proto/auth
# Authorization deps
COPY libs/auth-core ./libs/auth-core
COPY libs/auth-core-utils ./libs/auth-core-utils
COPY libs/auth-database ./libs/auth-database
COPY libs/shared-utils ./libs/shared-utils
# Application deps
COPY libs/bootstrap ./libs/bootstrap
COPY libs/types ./libs/types
# Microservices deps
COPY libs/rmq-config ./libs/rmq-config
# Auth Deps
COPY libs/auth-utils ./libs/auth-utils
COPY libs/auth-feature ./libs/auth-feature
COPY libs/session-feature ./libs/session-feature
COPY libs/token-feature ./libs/token-feature
COPY libs/user-feature ./libs/user-feature

RUN npm ci
RUN npm run auth-db:generate
RUN npm run nx:sync
RUN npx nx build auth

FROM node:26.3-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:26.3-alpine AS worker

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/services/auth/dist ./dist
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/libs/auth-core/dist ./node_modules/@org/auth-core
COPY --from=builder /app/libs/auth-core-utils/dist ./node_modules/@org/auth-core-utils
COPY --from=builder /app/libs/auth-database/dist ./node_modules/@org/auth-database
COPY --from=builder /app/libs/shared-utils/dist ./node_modules/@org/shared-utils
COPY --from=builder /app/libs/bootstrap/dist ./node_modules/@org/bootstrap
COPY --from=builder /app/libs/types/dist ./node_modules/@org/types
COPY --from=builder /app/libs/rmq-config/dist ./node_modules/@org/rmq-config
COPY --from=builder /app/libs/auth-utils/dist ./node_modules/@org/auth-utils
COPY --from=builder /app/libs/auth-feature/dist ./node_modules/@org/auth-feature
COPY --from=builder /app/libs/session-feature/dist ./node_modules/@org/session-feature
COPY --from=builder /app/libs/token-feature/dist ./node_modules/@org/token-feature
COPY --from=builder /app/libs/user-feature/dist ./node_modules/@org/user-feature
COPY --from=deps /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/main.js"]
