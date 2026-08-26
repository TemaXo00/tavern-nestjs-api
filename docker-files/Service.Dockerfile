FROM node:26.3-alpine AS builder

ARG SERVICE_NAME

WORKDIR /app

COPY ./services/$SERVICE_NAME ./services/$SERVICE_NAME
COPY libs libs/
COPY proto ./proto

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

RUN npm ci
RUN npm run nx:sync
RUN npm run $SERVICE_NAME-db:generate
RUN npx nx build $SERVICE_NAME

FROM node:26.3-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:26.3-alpine AS worker

ARG SERVICE_NAME

WORKDIR /app

COPY --from=builder /app/services/$SERVICE_NAME/dist ./dist
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/libs ./node_modules/@org
COPY --from=deps /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/main.js"]