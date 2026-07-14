const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Provide a valid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ],
  validationMiddleware,
  authController.register
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Provide a valid email address"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validationMiddleware,
  authController.login
);

router.get("/profile", authMiddleware, authController.profile);

module.exports = router;
