const router = require("express").Router();
const { body, param, query } = require("express-validator");
const todoController = require("../controllers/todo.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

// Protect all todo routes with JWT verification
router.use(authMiddleware);

// Get dashboard stats (defined before /:id to avoid collision)
router.get("/stats", todoController.getStats);

// Get all todos with filtering, sorting, pagination, and searching
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    query("status").optional().isIn(["Pending", "Completed"]).withMessage("Invalid status filter"),
    query("priority").optional().isIn(["Low", "Medium", "High"]).withMessage("Invalid priority filter"),
    query("sortBy").optional().isIn(["createdAt", "dueDate", "title", "priority", "status"]).withMessage("Invalid sort field"),
    query("order").optional().isIn(["ASC", "DESC"]).withMessage("Invalid order direction")
  ],
  validationMiddleware,
  todoController.getAll
);

// Create new todo
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim(),
    body("priority").optional().isIn(["Low", "Medium", "High"]).withMessage("Priority must be Low, Medium, or High"),
    body("status").optional().isIn(["Pending", "Completed"]).withMessage("Status must be Pending or Completed"),
    body("dueDate").optional({ checkFalsy: true }).isISO8601().withMessage("Due date must be a valid ISO8601 date")
  ],
  validationMiddleware,
  todoController.create
);

// Get todo by ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("Todo ID must be an integer")],
  validationMiddleware,
  todoController.getById
);

// Update todo details
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("Todo ID must be an integer"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim(),
    body("priority").isIn(["Low", "Medium", "High"]).withMessage("Priority must be Low, Medium, or High"),
    body("status").isIn(["Pending", "Completed"]).withMessage("Status must be Pending or Completed"),
    body("dueDate").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Due date must be a valid date")
  ],
  validationMiddleware,
  todoController.update
);

// Delete todo
router.delete(
  "/:id",
  [param("id").isInt().withMessage("Todo ID must be an integer")],
  validationMiddleware,
  todoController.delete
);

// Patch status
router.patch(
  "/:id/status",
  [
    param("id").isInt().withMessage("Todo ID must be an integer"),
    body("status").isIn(["Pending", "Completed"]).withMessage("Status must be Pending or Completed")
  ],
  validationMiddleware,
  todoController.updateStatus
);

module.exports = router;
