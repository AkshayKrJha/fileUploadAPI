import dotenv from "dotenv";
import app from "./index.js";
import { dbConnection } from "./database/db.cjs";
dotenv.config();
const startServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    // Connect to the real database
    await dbConnection();
    // Start the server
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};
startServer();
