require("dotenv").config();
const mongooseDB = require("mongoose");
async function dbConnection() {
  try {
    await mongooseDB.connect(process.env.MONGODB_URL);
    console.log("Successfully connected to mongoDB");
  } catch (error) {
    console.error(error);
  }
  mongooseDB.connection.on("error", (error) => {
    console.error("MongoDB Connection Error", error);
  });
  mongooseDB.connection.on("disconnected", () => {
    console.log("MongoDB Disconnected");
  });
  mongooseDB.connection.on("connected", () => {
    console.log("MongoDB Connected");
  });
  mongooseDB.connection.on("reconnected", () => {
    console.log("MongoDB Reconnected");
  });
  mongooseDB.connection.on("close", () => {
    console.log("MongoDB Connection Closed");
  });
}

module.exports = { dbConnection, mongooseDB };
