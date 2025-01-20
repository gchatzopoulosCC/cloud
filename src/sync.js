/* Sync models with database */

const { sessionStore, sequelize } = require("./db");
require("./models/userModel");

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((error) => {
    console.error("Unable to synchronize the models:", error.message);
  });

sessionStore.sync()
  .then(() => {
    console.log("Session store synchronized successfully.");
  })
  .catch((error) => {
    console.error("Unable to synchronize the session store:", error.message);
  });