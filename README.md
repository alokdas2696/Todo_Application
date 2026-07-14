# Production-Ready Todo Application (MVC & Repository Pattern)

This project is a full-stack, production-ready Todo List application built with a modern Angular frontend, Node.js + Express.js backend, Sequelize ORM, and MySQL database. It strictly implements the MVC (Model-View-Controller) architecture combined with the Repository Pattern to decouple database operations from application business logic.

---

## 🏗️ Architecture & Flow

The backend structure uses a strict repository pattern to ensure clean separation of concerns:
```
Client (Angular)
   │
   ▼
Route (Express)
   │
   ▼
Controller (Express)
   │
   ▼
Service (Business Logic)
   │
   ▼
Repository (DB Queries)
   │
   ▼
Sequelize Model
   │
   ▼
MySQL Database
```

*   **Controllers** process HTTP payloads, validate inputs (via `express-validator`), and trigger services. They *never* access models directly.
*   **Services** manage business workflows, access tokens, and check permissions.
*   **Repositories** contain raw query operations, SQL aggregations, and Sequelize models mapping.

---

## 📂 Project Structure

```
todo-app/
│
├── backend/                  (Node.js + Express + Sequelize)
│   ├── migrations/           (Sequelize DB Migrations)
│   ├── seeders/              (Sequelize Demo & Mock Seed Data)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js   (DB Connection Settings)
│   │   ├── controllers/      (Request and Response mapping)
│   │   ├── middleware/       (Auth, validator hooks, central errors handler)
│   │   ├── models/           (Sequelize Schemas & Relations)
│   │   ├── repositories/     (DB querying encapsulation)
│   │   ├── routes/           (URL router maps)
│   │   ├── services/         (Core Business Operations)
│   │   ├── app.js            (Express server setup)
│   │   └── server.js         (HTTP listener bootstrapper)
│   ├── .env.example
│   ├── eslint.config.js
│   ├── .prettierrc
│   └── package.json
│
├── frontend/                 (Angular SPA)
│   ├── src/app/
│   │   ├── core/             (Services, Interceptors, Guards)
│   │   ├── features/         (Auth, Dashboard, Todo list, Profile page components)
│   │   ├── layouts/          (Toolbar & Sidenav layout)
│   │   ├── shared/           (Interfaces and Common UI components)
│   │   ├── app.config.ts     (Providers & Interceptors initialization)
│   │   └── app.routes.ts     (Angular routing configuration)
│   ├── angular.json
│   └── package.json
│
└── .gitignore
```

---

## 🔐 Security Features

1.  **Helmet**: Configures protective HTTP headers to guard against common exploits like Clickjacking or XSS.
2.  **CORS**: Configured on the backend to restrict origin access to verified domains.
3.  **JWT Authentication**: JWT tokens are signed using a robust HS256 secret. Validated at the route level via a custom auth middleware.
4.  **Bcrypt**: User passwords are encrypted using `bcryptjs` (salt rounds: 10) before storage.
5.  **SQL Injection Protection**: Raw parameters are escaped via Sequelize's parameterized bindings.
6.  **Input Validation**: Express routes execute parameter type-checks and constraints via `express-validator`.

---

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v18 or higher)
*   MySQL Server (v8 or higher)
*   Angular CLI (v19/v20)

---

### Step 1: Database Setup
1. Log in to your local MySQL terminal or admin tool (e.g. phpMyAdmin, Workbench):
   ```sql
   CREATE DATABASE todo_db;
   ```

---

### Step 2: Backend Configuration
1. Open the `backend/` directory.
2. Duplicate `.env.example` and name it `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update connection details in `.env`:
   ```properties
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=todo_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=use_a_long_random_hash_string_here
   JWT_EXPIRES_IN=24h
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the migrations to build database tables:
   ```bash
   npm run db:migrate
   ```
6. Run seeders to load the demo user and initial tasks:
   ```bash
   npm run db:seed
   ```
7. Start the Express server:
   *   **Development**: `npm run dev`
   *   **Production**: `npm start`

---

### Step 3: Frontend Configuration
1. Open the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular dev server:
   ```bash
   npm start
   ```
4. Access the web app at: `http://localhost:4200`
5. Log in with the default seed account:
   *   **Email**: `admin@example.com`
   *   **Password**: `admin123`

---

## 📡 REST API Documentation

All API responses follow a uniform contract format.

### Success Envelope
```json
{
  "success": true,
  "message": "Retrieval success",
  "data": { ... }
}
```

### Error Envelope
```json
{
  "success": false,
  "message": "Error details description",
  "errors": [ ... ]
}
```

### Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user | No |
| **POST** | `/api/auth/login` | Login user and retrieve JWT | No |
| **GET** | `/api/auth/profile` | Retrieve profile user attributes | Yes |
| **GET** | `/api/todos` | List todos (with paging/search/sort/filters) | Yes |
| **POST** | `/api/todos` | Create a new todo | Yes |
| **GET** | `/api/todos/:id` | Retrieve specific todo details | Yes |
| **PUT** | `/api/todos/:id` | Update specific todo details | Yes |
| **DELETE** | `/api/todos/:id` | Delete a todo | Yes |
| **PATCH** | `/api/todos/:id/status` | Mark complete/pending status only | Yes |
| **GET** | `/api/todos/stats` | Retrieve dashboard totals | Yes |

---

## 🧪 Build and Build Production

To prepare the application for production hosting:

### Backend Build
No compiler is needed for Node/CommonJS. Simply check linting:
```bash
npm run lint
```

### Frontend Build
Compile the Angular assets for host serving:
```bash
npm run build
```
This outputs minified assets inside `frontend/dist/frontend/browser/`.

---

## 🛳️ Production Deployment Steps

1.  **Serve Static Files**: Serve the compiled Angular frontend directory (`frontend/dist/frontend/browser`) using a reverse proxy like Nginx or cloud hosts (Vercel, Netlify, AWS S3).
2.  **Reverse Proxy**: Direct API traffic (`/api/*`) through Nginx or Cloudflare to point to the backend Node server port (e.g. `3000`).
3.  **Process Manager**: Keep backend server running in production using a process monitor like PM2:
    ```bash
    pm2 start src/server.js --name "todo-api"
    ```
4.  **SSL Configuration**: Enforce HTTPS via Let's Encrypt certificates.
