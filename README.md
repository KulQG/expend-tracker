# Expenditure Tracker

Fullstack приложение для учёта расходов. Оффлайн-first (PWA) с синхронизацией через SSE.

**Stack:** React 19 + Vite + Chakra UI · Express 5 + Prisma · PostgreSQL · Docker

---
## Посмотреть [DEMO](http://v3159022.hosted-by-vdsina.ru:3000/) (без оффлайн-режима)
---

## Быстрый старт

### 1. Клонировать и настроить переменные окружения

```bash
git clone https://github.com/KulQG/expend-tracker.git
cd expend-tracker

cp .env.example .env
```

### 2. Запустить одной командой

```bash
docker compose up --build
```

| Сервис   | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8080 |
| Health   | http://localhost:8080/health |

Остановить:

```bash
docker compose down
```

Остановить и удалить данные БД:

```bash
docker compose down -v
```

---

## Разработка без Docker

### Backend

```bash
cd expenditure-tracker-backend
cp ../.env.example .env  # или создай свой
pnpm install
pnpm exec prisma migrate dev
pnpm dev
```

### Frontend

```bash
cd expenditure-tracker-frontend
pnpm install
pnpm dev
```

---

## Переменные окружения

| Переменная                          | Описание                          | По умолчанию             |
|-------------------------------------|-----------------------------------|--------------------------|
| `POSTGRES_USER`                     | Пользователь PostgreSQL           | `postgres`               |
| `POSTGRES_PASSWORD`                 | Пароль PostgreSQL                 | —                        |
| `POSTGRES_DB`                       | Имя базы данных                   | `expend_tracker`         |
| `BACKEND_PORT`                      | Порт бэкенда                      | `8080`                   |
| `NODE_ENV`                          | Окружение                         | `production`             |
| `FRONTEND_PORT`                     | Порт фронтенда (nginx)            | `3000`                   |
| `VITE_PUBLIC_API_URL`               | Базовый URL API                   | `http://localhost:8080/` |
| `VITE_PUBLIC_API_URL_EXPENDITURES`  | URL для expenditures endpoint     | `http://localhost:8080/api/expenditures/` |

---
