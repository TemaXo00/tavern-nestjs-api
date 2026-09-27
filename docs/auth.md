# Сервис авторизации

## Реализованный функционал

- Полный цикл авторизации пользователя:
  - Метод регистрации
  - Метод входа в аккаунт
  - Метод ротации Access и Refresh токенов
  - Выход из аккаунта
- Использование JWT-токенов для валидации. Payload состоит из:
  - id пользователя
  - id сессии
  - роль пользователя (хранится в формате числа для соответствия gRPC-proto)
- Хранение сессий при помощи PostgreSQL базы данных. Для хранения реализованы методы на хеширование и проверку Refresh-токена
- Работа с токенами для восстановления пароля. Токен хранится в базе данных захешированный
- Работа с пользователями. Блокировка/разблокировка, изменение роли, изменение пароля и email
- Полная типизация всех запросов и ответов в соответствии с gRPC-схемой и схемой для HTTP
- SDK для валидации пользователя, предоставляющее возможность переиспользования логики Validate и ValidateWithRoles в остальных микросервисах. Пример использования:

```ts
const payload = await this.authValidate.Validate(data);
// payload: { id, sessionId, role }
```

## ENV-переменные

- **TAVERN_AUTH_GRPC_PORT** - порт для получения gRPC запросов (по умолчанию 5000)
- **TAVERN_JWT_SECRET** - JWT-секрет для подписи токенов
- **TAVERN_JWT_ACCESS_TOKEN_TTL** - время жизни Access токена. Выражается в минутах (по умолчанию 15 минут)
- **TAVERN_JWT_REFRESH_TOKEN_TTL** - время жизни Refresh токена. Выражается в днях (по умолчанию 30 дней)
- **TAVERN_AUTH_DB_URL** - ссылка на базу данных
- **TAVERN_RMQ_USER** - пользователь для RabbitMQ
- **TAVERN_RMQ_PASSWORD** - пароль для RabbitMQ
- **TAVERN_RMQ_URL** - URL для RabbitMQ
- **TAVERN_REDIS_URL** - URL для Redis
- **TAVERN_REDIS_PASSWORD** - пароль для Redis

## Безопасность

- Пароли: argon2id (timeCost 3, memoryCost 64MB, parallelism 4)
- Refresh-токены: argon2id, хеш в БД
- Access-токены: JWT HS256, TTL 15 минут
- Redis-кэш payload: TTL = TTL access-токена
- Валидация сессии: device + os + browser должны совпадать
- Блокировка: при `isBlocked && blockedUntil > now` — все сессии сбрасываются

## Жизненный цикл токена

1. **Логин** → генерируется access + refresh
2. **Access-токен** передаётся в `ValidateInput` для gRPC-методов
3. **Validate** проверяет: JWT-подпись → Redis-кэш → сессия в БД → блокировка/активность юзера
4. **Refresh** → старый refresh-токен верифицируется по хешу (argon2), генерируется новая пара, сессия обновляется
5. **Logout** → сессия удаляется из БД, payload удаляется из Redis

## Методы микросервиса

**Примечание:** Auth в "Роли" означает, что метод может вызываться ЛЮБЫМ зарегистрированным пользователем

### AuthService

| Метод          | Описание               | Роли |
| -------------- | ---------------------- | ---- |
| Register       | Регистрация            | —    |
| Login          | Вход                   | —    |
| Refresh        | Обновление токенов     | —    |
| Logout         | Выход                  | —    |
| Validate       | Проверка токена        | —    |
| ForgotPassword | Запрос на сброс пароля | —    |
| ResetPassword  | Сброс пароля           | —    |
| GetMe          | Текущий пользователь   | Auth |

### SessionService

| Метод                  | Описание             | Роли             |
| ---------------------- | -------------------- | ---------------- |
| GetSessionsByUser      | Сессии пользователя  | ADMIN, MODERATOR |
| GetMySessions          | Мои сессии           | Auth             |
| ChangeSessionLocalName | Переименовать сессию | Auth             |
| DeleteSessionById      | Удалить сессию       | Auth             |
| DeleteAllSessions      | Удалить все сессии   | Auth             |

### TokenService

| Метод                    | Описание            | Роли  |
| ------------------------ | ------------------- | ----- |
| GetTokensWithPagination  | Список токенов      | ADMIN |
| GetTokenById             | Токен по ID         | ADMIN |
| SetTokenRevoked          | Отозвать токен      | ADMIN |
| DeleteTokenById          | Удалить токен       | ADMIN |
| DeleteAllNotActiveTokens | Очистить неактивные | ADMIN |

### UserService

| Метод               | Описание                  | Роли             |
| ------------------- | ------------------------- | ---------------- |
| GetAllUsers         | Список пользователей      | ADMIN, MODERATOR |
| GetUserById         | Пользователь по ID        | ADMIN, MODERATOR |
| BlockUser           | Заблокировать             | ADMIN, MODERATOR |
| UnblockUser         | Разблокировать            | ADMIN, MODERATOR |
| PromoteToModerator  | Повысить                  | ADMIN            |
| DemoteFromModerator | Понизить                  | ADMIN            |
| ChangeEmail         | Сменить email             | Auth             |
| ChangePassword      | Сменить пароль            | Auth             |
| SetUserInactive     | Деактивировать себя       | Auth             |
| ChangeUserToActive  | Активировать пользователя | ADMIN            |
