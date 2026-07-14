# Free Cloud Deployment Guide

This guide describes how to deploy your full-stack Todo application to the cloud **100% free of cost**. 

We will use the following free cloud tiers:
1.  **Database**: **Aiven** (Offers a free, non-expiring MySQL database).
2.  **Backend API**: **Render** (Offers a free tier for Node.js web services).
3.  **Frontend SPA**: **Vercel** or **Render Static Sites** (Offers free static hosting for Angular).

---

## 🛠️ Step 1: Deploy your MySQL Database (Free on Aiven)

[Aiven](https://aiven.io/) provides a reliable free-tier MySQL instance.

1.  Go to [Aiven.io](https://aiven.io/) and sign up for a free account.
2.  Create a new project, click **Create Service**, select **MySQL**, and choose the **Free** plan.
3.  Choose a region closest to you (e.g., AWS or GCP free locations) and name your service `todo-mysql`.
4.  Once the database service status shows **Running** (takes 2–3 minutes):
    *   Find the **Connection Details** on the service dashboard.
    *   Copy the **Host**, **Port**, **User** (usually `avnadmin`), **Password**, and **Database name** (usually `defaultdb`).

---

## ⚙️ Step 2: Push your Code to GitHub

Make sure your latest codebase is pushed to your GitHub repository at `https://github.com/alokdas2696/Todo_Application`:

```bash
# Run this in your local terminal to push the latest commit
git push -u origin main --force
```

---

## 🚀 Step 3: Deploy the Backend API (Free on Render)

[Render](https://render.com/) hosting connects directly to GitHub.

1.  Go to [Render.com](https://render.com/) and register/login using your **GitHub account**.
2.  On the dashboard, click **New +** and select **Web Service**.
3.  Connect your `Todo_Application` GitHub repository.
4.  Configure the service details:
    *   **Name**: `todo-backend-api`
    *   **Language**: `Node`
    *   **Root Directory**: `backend` (⚠️ Very Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Instance Type**: `Free`
5.  Click the **Advanced** button and add these **Environment Variables**:
    *   `PORT` = `10000` (Render's default)
    *   `DB_HOST` = `[Your Aiven Hostname]`
    *   `DB_PORT` = `[Your Aiven Port]`
    *   `DB_USER` = `avnadmin`
    *   `DB_PASSWORD` = `[Your Aiven Password]`
    *   `DB_NAME` = `defaultdb`
    *   `JWT_SECRET` = `[Create a long random string]`
    *   `JWT_EXPIRES_IN` = `24h`
    *   `NODE_ENV` = `production`
6.  Click **Create Web Service**. Render will install, run migrations, and start your backend.
7.  Once deployed, Render will display a URL (e.g., `https://todo-backend-api-xxxx.onrender.com`). **Copy this URL**.

---

## 🎨 Step 4: Link Frontend to Production Backend

Before deploying the frontend, update the production API target to point to your new Render backend.

1.  Open `frontend/src/app/api-config.ts` in your codebase.
2.  Replace the placeholder production URL with your actual Render backend URL:
    ```typescript
    export const API_BASE_URL = isDevMode()
      ? "http://localhost:3000"
      : "https://todo-backend-api-xxxx.onrender.com"; // Your Render URL here
    ```
3.  Commit and push the change to GitHub:
    ```bash
    git add frontend/src/app/api-config.ts
    git commit -m "Update production API URL"
    git push origin main
    ```

---

## 💻 Step 5: Deploy the Frontend (Free on Vercel)

[Vercel](https://vercel.com/) is perfect for hosting Angular apps. It automatically handles Single Page Application (SPA) routing/rewrites.

1.  Go to [Vercel.com](https://vercel.com/) and log in using your **GitHub account**.
2.  Click **Add New...** and select **Project**.
3.  Import your `Todo_Application` repository.
4.  Configure the project details:
    *   **Framework Preset**: `Angular`
    *   **Root Directory**: `frontend` (⚠️ Very Important!)
    *   **Build Command**: `ng build`
    *   **Output Directory**: `dist/frontend/browser` (or default compiled path)
5.  Click **Deploy**.
6.  Vercel will compile the Angular app and deploy it on a free `.vercel.app` domain.

🎉 **Congratulations! Your full-stack Todo application is now live on the internet, completely free of charge!**
