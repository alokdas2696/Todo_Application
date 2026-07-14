const todoService = require("../services/todo.service");

class TodoController {
  async create(req, res, next) {
    try {
      const todo = await todoService.createTodo(req.userId, req.body);
      return res.status(201).json({
        success: true,
        message: "Todo created successfully",
        data: { todo }
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        search: req.query.search,
        sortBy: req.query.sortBy,
        order: req.query.order,
        page: req.query.page,
        limit: req.query.limit
      };
      const result = await todoService.getTodos(req.userId, filters);
      return res.status(200).json({
        success: true,
        message: "Todos retrieved successfully",
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const todo = await todoService.getTodoById(req.params.id, req.userId);
      return res.status(200).json({
        success: true,
        message: "Todo retrieved successfully",
        data: { todo }
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const todo = await todoService.updateTodo(req.params.id, req.userId, req.body);
      return res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: { todo }
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await todoService.deleteTodo(req.params.id, req.userId);
      return res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: {}
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const todo = await todoService.updateTodoStatus(req.params.id, req.userId, status);
      return res.status(200).json({
        success: true,
        message: "Todo status updated successfully",
        data: { todo }
      });
    } catch (error) {
      return next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await todoService.getStats(req.userId);
      return res.status(200).json({
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: { stats }
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TodoController();
