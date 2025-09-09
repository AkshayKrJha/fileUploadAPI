import bp from "body-parser";
import dotenv from "dotenv";
import express from "express";
import assessmentRouter from "./routes/assessment-management.mjs";
import audioComicsRouter from "./routes/audio-comics-management.mjs";
import ComicsRouter from "./routes/comics-management.mjs";
import { dbConnection } from "./database/db.cjs";
import podcastRouter from "./routes/podcast-management.mjs";
import vehiclesRouter from "./routes/vehicles.mjs";
import bookingsRouter from "./routes/bookings.mjs";
const app = express();
dotenv.config();
// const port = process.env.PORT;
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
// app.use()

// start connection
// dbConnection();

// app.use("/api/audioComics", audioComicsRouter);
// app.use("/api/comics", ComicsRouter);
// app.use("/api/podcast", podcastRouter);
// app.use("/api/assessment", assessmentRouter);

app.use("/api/vehicles/", vehiclesRouter);
app.use("/api/bookings/", bookingsRouter);

// Database connection and server start
// const startServer = async () => {
//   const port = process.env.PORT || 3000;
//   try {
//     // Start the database connection
//     dbConnection();
//     // Start the server
//     app.listen(port, () => {
//       console.log(`Server started on port ${port}`);
//     });
//   } catch (err) {
//     console.error("Failed to start server:", err.message);
//     process.exit(1);
//   }
// };

// startServer();

export default app;
