require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log("====================================================");
    console.log("Database connection established successfully.");
    console.log("====================================================");
  } catch (error) {
    console.error("====================================================");
    console.error("WARNING: Database connection failed!");
    console.error(`Reason: ${error.message}`);
    console.error("Please configure the database in your '.env' file.");
    console.error("Ensure MySQL server is running and database exists.");
    console.error("====================================================");
  }

  app.listen(PORT, () => {
    console.log(`Express Server is running on port: ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
  });
}

start();
