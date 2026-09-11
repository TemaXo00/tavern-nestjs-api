# Tavern API

## Описание

Данный API является представлением серверной архитектуры приложения, нацеленного на создание event-платформы. Разработан в рамках курсового проекта дисциплины "Программирование сетевых приложений"

## Быстрый старт

```bash
# Клонируем репозиторий
git clone https://github.com/TemaXo00/tavern-nestjs-api.git

# Создаем переменные окружения из примеров
cp .env.example .env
cp app/.env.example app/.env

# Устанавливаем зависимости и запускаем приложение
cd app
npm i
docker compose up --build -d && npm run all:dev
```

## Установка

1 Клонируем репозиторий

```bash
git clone https://github.com/TemaXo00/tavern-nestjs-api.git
```

2 Создаем свои настройки в .env:

```bash
cp .env.example .env
cp app/.env.example app/.env

nano .env
nano app/.env
```

3 Устанавливаем зависимости NPM

```bash
cd app
npm i
```

4 Запускаем приложение

```bash
docker compose up --build -d && npm run all:dev
```

При необходимости тестирования gRPC/HTTP методов без Swagger - можно использовать Bruno. Для настройки переменных окружения следует сделать следующее:

```bash
# Для каждой коллекции
# Переходим в директорию коллекции
cd .bruno/collections/название_коллекции
# Клонируем пример
cp environments-example environments
# При заходе в Bruno, как Workspace выбираем директорию .bruno в корне проекта
```

## Техническая информация

Написан при помощи следующих основных технологий:

- [NestJS 11.0.0](https://nestjs.com/)
- [NX 23.1.1](https://nx.dev/)
- [Prisma ORM 7.9.1](https://www.prisma.io/orm)
- [PostgreSQL 18.4](https://www.postgresql.org/)
- [Redis 8.6.5](https://redis.io/)
- [RabbitMQ 4.2.4](https://www.rabbitmq.com/)

Разработка приложения велась при помощи следующего программного обеспечения:

- [NodeJS 26.8 и новее](https://nodejs.org/en)
- [Docker 29.7.2 и новее](https://www.docker.com/)
- [Редактор кода Zed](https://zed.dev/)
- [API клиент Bruno](https://www.usebruno.com/)

## Архитектура проекта

```text
.
├── app                   # Директория приложения
├── .bruno                # Конфигурация Bruno
├── docker-compose.yml    # Конфигурация контейнеров
├── docker-files          # Файлы сборки проекта
├── .dockerignore         # Игнорируемые файлы Docker
├── docs                  # Документация
├── .env.example          # Пример файла .env
├── .gitignore            # Игнорируемые файлы Git
├── README.md             # Документация
├── scripts               # Bash-скрипты
└── .zed                  # Конфигурация Zed
```

## Информация о сервисах

Документация по каждому сервису приложения представлена в следующих файлах:

- [Сервис Авторизации](docs/auth.md)
