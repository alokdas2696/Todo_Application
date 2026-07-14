module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  // Parse Sequelize Validation Errors
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = "Database validation failed";
    errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message
    }));
  } else {
    errors = [err.message || "An unexpected error occurred"];
  }

  // Log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.error("Centralized Error Handler:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
