const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Global Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable Cross-Origin Requests for frontend
app.use(morgan("dev")); // Request Logger

// Parse JSON and Urlencoded Request Bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default API landing
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Todo MVC Application API",
    data: {
      version: "1.0.0"
    }
  });
});

// Mount Feature Routers
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Unmatched Route (404) Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
