# Todo Application Backend (Express + Sequelize)

This directory contains the Express backend for the Todo MVC application. It implements the MVC and Repository patterns with Sequelize ORM and MySQL.

## Features
* JWT-based authentication
* Repository pattern for database transactions
* Dynamic input checking via `express-validator`
* Secure headers with `helmet` and cross-origin setup via `cors`
* Centralized errors handler middleware

## File Tree
```
backend/
├── src/
│   ├── config/          (Sequelize DB config)
│   ├── controllers/     (HTTP request controllers)
│   ├── middleware/      (JWT auth, validators, errors handler)
│   ├── models/          (Sequelize DB Schemas)
│   ├── repositories/    (Database transaction functions)
│   ├── routes/          (URL mappings)
│   ├── services/        (Core Business workflow services)
│   ├── app.js           (Express configuration)
│   └── server.js        (Express server bootstrapper)
├── migrations/          (Sequelize table schema creations)
├── seeders/             (Demo mock user and tasks data)
├── .env.example
└── package.json
```

## Local Setup
1. Define database settings in `.env` (copied from `.env.example`).
2. Run database migrations:
   ```bash
   npm run db:migrate
   ```
3. Run database seeders:
   ```bash
   npm run db:seed
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```
