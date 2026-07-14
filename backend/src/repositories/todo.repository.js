const { Todo } = require("../models");
const { Op } = require("sequelize");

class TodoRepository {
  async create(todoData) {
    return await Todo.create(todoData);
  }

  async findById(id, userId) {
    return await Todo.findOne({
      where: { id, createdBy: userId }
    });
  }

  async findAll(userId, filters = {}) {
    const {
      status,
      priority,
      search,
      sortBy = "createdAt",
      order = "DESC",
      page = 1,
      limit = 10
    } = filters;

    const whereClause = { createdBy: userId };

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Todo.findAndCountAll({
      where: whereClause,
      order: [[sortBy, order]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    return {
      total: count,
      todos: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10)
    };
  }

  async update(id, userId, todoData) {
    const [updatedRows] = await Todo.update(todoData, {
      where: { id, createdBy: userId }
    });
    if (updatedRows === 0) return null;
    return await this.findById(id, userId);
  }

  async delete(id, userId) {
    return await Todo.destroy({
      where: { id, createdBy: userId }
    });
  }

  async getStats(userId) {
    const stats = await Todo.findAll({
      where: { createdBy: userId },
      attributes: [
        [Todo.sequelize.fn("COUNT", Todo.sequelize.col("id")), "totalCount"],
        [Todo.sequelize.fn("SUM", Todo.sequelize.literal("CASE WHEN status = 'Completed' THEN 1 ELSE 0 END")), "completedCount"],
        [Todo.sequelize.fn("SUM", Todo.sequelize.literal("CASE WHEN status = 'Pending' THEN 1 ELSE 0 END")), "pendingCount"],
        [Todo.sequelize.fn("SUM", Todo.sequelize.literal("CASE WHEN priority = 'High' THEN 1 ELSE 0 END")), "highPriorityCount"]
      ],
      raw: true
    });

    const result = stats[0] || {};
    return {
      total: parseInt(result.totalCount || 0, 10),
      completed: parseInt(result.completedCount || 0, 10),
      pending: parseInt(result.pendingCount || 0, 10),
      highPriority: parseInt(result.highPriorityCount || 0, 10)
    };
  }
}

module.exports = new TodoRepository();
