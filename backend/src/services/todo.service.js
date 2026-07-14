const todoRepository = require("../repositories/todo.repository");

class TodoService {
  async createTodo(userId, todoData) {
    const data = {
      ...todoData,
      createdBy: userId
    };
    return await todoRepository.create(data);
  }

  async getTodoById(id, userId) {
    const todo = await todoRepository.findById(id, userId);
    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  async getTodos(userId, filters) {
    return await todoRepository.findAll(userId, filters);
  }

  async updateTodo(id, userId, todoData) {
    const todo = await todoRepository.findById(id, userId);
    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      throw error;
    }
    return await todoRepository.update(id, userId, todoData);
  }

  async deleteTodo(id, userId) {
    const todo = await todoRepository.findById(id, userId);
    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      throw error;
    }
    await todoRepository.delete(id, userId);
    return true;
  }

  async updateTodoStatus(id, userId, status) {
    const todo = await todoRepository.findById(id, userId);
    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      throw error;
    }
    return await todoRepository.update(id, userId, { status });
  }

  async getStats(userId) {
    return await todoRepository.getStats(userId);
  }
}

module.exports = new TodoService();
