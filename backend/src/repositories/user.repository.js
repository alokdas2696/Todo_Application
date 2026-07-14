const { User } = require("../models");

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, userData) {
    const [updatedRows] = await User.update(userData, { where: { id } });
    if (updatedRows === 0) return null;
    return await this.findById(id);
  }
}

module.exports = new UserRepository();
