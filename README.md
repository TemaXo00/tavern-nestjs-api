# Tavern API

## Описание

Данный API является представлением серверной архитектуры приложения, нацеленного на создание event-платформы. Разработан в рамках курсового проекта дисциплины "Программирование сетевых приложений"

## Быстрый старт

```bash
# Клонируем репозиторий
git clone https://github.com/TemaXo00/tavern-nestjs-api.git

# Запускаем скрипт настройки
bash scripts/dev-workspace.setup.sh

# Запускаем Docker-инфраструктуру
docker compose -f docker-compose.infra.yml up --build -d

# Запускаем приложение
cd app
npm run all:dev
```

## Ручная установка

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

3 Создаем образ tavern-migrator

```bash
docker build -f docker-files/Db-Migrator.Dockerfile -t tavern/migrator:latest .
```

4 Устанавливаем зависимости NPM

```bash
cd app
npm i
```

5 Запускаем приложение

```bash
# Из корня проекта
docker compose -f docker-compose.infra.yml up --build -d && cd app && npm run all:dev
```

При необходимости тестирования gRPC методов - можно использовать Bruno. Для настройки переменных окружения следует сделать следующее:

```bash
# Переходим в директорию конфигурации. Делается из корня проекта
cd .bruno/
# Клонируем пример и переиименовываем в environments
cp environments-example environments
# При заходе в Bruno, как Workspace выбираем директорию .bruno в корне проекта
```

Для тестирования HTTP-методов - рекомендуется использовать Swagger и запущенные микросервисы. При порте 3000 у API Gateway, путь к Swagger следующий: localhost:3000/api/docs

Также поддерживается возможность генерации OpenAPI-документаици в форматах JSON и YAML:

```bash
# Пример получения документации Swagger в формате JSON
curl localhost:3000/api/docs/swagger.json
# Пример получения документации Swagger в формате YAML
curl localhost:3000/api/docs/swagger.yaml
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

- [NodeJS 26.3 и новее](https://nodejs.org/en)
- [Docker 29.7.2 и новее](https://www.docker.com/)
- [Редактор кода Zed](https://zed.dev/)
- [API клиент Bruno](https://www.usebruno.com/)

## Архитектура проекта

```text
.
├── app/                        # Nx-монорепа с сервисами и libs
│   ├── services/               # Микросервисы
│   └── libs/                   # Общие библиотеки (@org/*)
├── .bruno                      # Конфигурация Bruno
├── docker-compose.infra.yml    # Конфигурация контейнеров
├── docker-files                # Файлы сборки проекта
├── .dockerignore               # Игнорируемые файлы Docker
├── docs                        # Документация
├── .env.example                # Пример файла .env
├── .gitignore                  # Игнорируемые файлы Git
├── README.md                   # Документация
├── scripts                     # Bash-скрипты
└── .zed                        # Конфигурация Zed
```

## Информация о сервисах

Документация по каждому сервису приложения представлена в следующих файлах:

- [API Gateway](docs/gateway.md)
- [Сервис Авторизации](docs/auth.md)

## Возможные ошибки

### Скрипт dev-workspace.setup.sh не работает

Возможно, необходимо дать ему права на запуск. В Linux/MacOS это делается следующим образом:

```bash
chmod +x scripts/dev-workspace.setup.sh
```

После этого скрипт будет отрабатывать корректно

### Docker: Невозможно получить образ tavern/migrator:latest

Возможно при использовании ручного метода установки проекта. Необходимо создать образ tavern/migrator:latest (пункт 3 раздела Ручная установка)
