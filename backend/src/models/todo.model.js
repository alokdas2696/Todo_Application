const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Todo = sequelize.define(
    "Todo",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("Pending", "Completed"),
        defaultValue: "Pending",
        allowNull: false,
        validate: {
          isIn: [["Pending", "Completed"]]
        }
      },
      priority: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        defaultValue: "Medium",
        allowNull: false,
        validate: {
          isIn: [["Low", "Medium", "High"]]
        }
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        }
      }
    },
    {
      tableName: "todos",
      timestamps: true
    }
  );

  return Todo;
};
