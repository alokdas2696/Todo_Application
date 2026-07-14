"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "todos",
      [
        {
          id: 1,
          title: "Review Project Guidelines",
          description: "Read the development specifications and MVC repository design requirements.",
          status: "Completed",
          priority: "High",
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          title: "Create Angular UI Screens",
          description: "Develop Dashboard, Todo Lists, Login and Registration pages using Angular Material.",
          status: "Pending",
          priority: "High",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          title: "Implement Database Migrations",
          description: "Set up MySQL tables, relations, and seeders via Sequelize.",
          status: "Completed",
          priority: "Medium",
          dueDate: new Date(),
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          title: "Deploy Application to Staging",
          description: "Configure environment variables and push to remote staging server.",
          status: "Pending",
          priority: "Low",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("todos", null, {});
  }
};
