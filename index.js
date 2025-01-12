import bp from "body-parser";
import dotenv from "dotenv";
import express from "express";
import assessmentRouter from "./assessment-management.mjs";
import audioComicsRouter from "./audio-comics-management.mjs";
import ComicsRouter from "./comics-management.mjs";
import { dbConnection } from "./database/db.cjs";
import podcastRouter from "./podcast-management.mjs";
const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
// app.use()

// start connection
dbConnection();

app.use("/api/audioComics", audioComicsRouter);
app.use("/api/comics", ComicsRouter);
app.use("/api/podcast", podcastRouter);
app.use("/api/assessment", assessmentRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
