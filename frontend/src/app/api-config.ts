import { isDevMode } from "@angular/core";

// Replace the production URL with your actual deployed Render/Railway backend URL once created
export const API_BASE_URL = isDevMode()
  ? "http://localhost:3000"
  : "https://todo-backend-alok.onrender.com"; // Your future free backend URL
