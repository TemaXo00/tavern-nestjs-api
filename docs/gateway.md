# API Gateway

## Назначение

Единая точка входа для HTTP-клиентов. Принимает REST-запросы, валидирует, маппит в gRPC и проксирует в микросервисы.

## Зачем gateway, а не прямой gRPC от клиента

- gRPC требует HTTP/2 и специфичных клиентов, браузеры его не умеют
- Gateway отдаёт привычный REST + Swagger-документацию
- Валидация DTO и ролей — на gateway, до вызова микросервиса
- Единая точка для CORS, rate limiting, логов HTTP-запросов

## Реализованный функционал

- Проксирование HTTP → gRPC
- Кастомные декораторы методов: `@GETProtectedMethod`, `@PATCHProtectedMethod`, `@QUERYProtectedMethod`
- Автоматическая валидация DTO через class-validator
- Извлечение `ValidateInput` из токена и заголовков сессии
- Swagger-документация, автогенерируемая из декораторов
- Кастомный ExceptionFilter для унификации ошибок
- Кастомный ResponseInterceptor для унификации ответов
- Логирование HTTP-запросов

## HTTP-методы

См. Swagger: `localhost:3000/api/docs`

## Кастомные декораторы

### `@GETProtectedMethod` / `@PATCHProtectedMethod` / `@QUERYProtectedMethod`

Объединяют `@Get`/`@Patch`/`@Query` + `@ApiOperation` + проверку ролей + Swagger-теги.

```ts
@PATCHProtectedMethod({
  path: ':id/block',
  operationDesc: 'Block user by ID',
  roles: [Roles.ADMIN, Roles.MODERATOR],
})
async blockUser(...) { ... }
```

### `@ValidateInputParam`

Извлекает access-токен и данные сессии (device, os, browser, ip) из заголовков и формирует `ValidateInput` для gRPC.

## ENV-переменные

- **TAVERN_GATEWAY_PORT** — порт HTTP (по умолчанию 3000)
- **TAVERN_JWT_SECRET** — JWT-секрет
- **AUTH_GRPC_URL** — URL auth-сервиса (например, `auth-service:5000` в Docker)
- **TAVERN_REDIS_URL** - URL для Redis
- **TAVERN_REDIS_PASSWORD** - пароль для Redis

## Переменные окружения для клиента

Для HTTP-запросов нужны заголовки:

- `Authorization: Bearer <accessToken>`
- `x-device`, `x-os`, `x-browser`, `x-ip` — данные сессии
