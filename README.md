# Clients DB API

API для управления клиентами, продавцами и рассрочками.

## Технологии

- NestJS
- MongoDB + Mongoose
- Docker

## Быстрый старт с Docker

```bash
# Запустить всё (приложение + MongoDB)
docker-compose up -d

# Посмотреть логи
docker-compose logs -f app

# Остановить
docker-compose down
```

Приложение будет доступно на http://localhost:3000

## Локальная разработка

### 1. Запустить только MongoDB

```bash
docker-compose up -d mongodb
```

### 2. Создать .env файл

```bash
# .env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://root:example@localhost:27017/clients-db?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Установить зависимости и запустить

```bash
yarn install
yarn start:dev
```

## API Endpoints

### Auth
- `POST /auth/sign-up` — Регистрация продавца
- `POST /auth/sign-in` — Авторизация

### Clients
- `GET /client` — Список клиентов
- `GET /client/:id` — Получить клиента
- `POST /client` — Создать клиента
- `PATCH /client/:id` — Обновить клиента
- `DELETE /client/:id` — Удалить клиента

### Contracts (Рассрочки)
- `GET /contract` — Список рассрочек
- `GET /contract/:id` — Получить рассрочку
- `GET /contract/client/:clientId` — Рассрочки клиента
- `GET /contract/seller/:sellerId` — Рассрочки продавца
- `POST /contract` — Создать рассрочку
- `PATCH /contract/:id` — Обновить рассрочку
- `DELETE /contract/:id` — Удалить рассрочку

## Структура проекта

```
src/
├── auth/           # Авторизация и JWT
├── client/         # CRUD клиентов
├── contract/       # CRUD рассрочек
├── seller/         # Продавцы
└── common/         # Фильтры, пайпы
```
