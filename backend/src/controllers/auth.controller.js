const authService = require("../services/auth.service");

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await authService.register(name, email, password);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: { user }
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data
      });
    } catch (error) {
      return next(error);
    }
  }

  async profile(req, res, next) {
    try {
      const user = await authService.getProfile(req.userId);
      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: { user }
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
