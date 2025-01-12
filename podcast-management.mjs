import express from "express";
import { Mongoose } from "mongoose";
import { mongooseDB } from "./database/db.cjs";
import { bucketUpload } from "./middleware.mjs";
const podcastRouter = express.Router();

podcastRouter.post(
  "/",
  bucketUpload("podcast", "podcast"),
  async (req, res) => {
    // create
    console.log("File data:", req.file);
    res.json({
      message: "File uploaded successfully",
      fileID: req.file.fileID,
    });
  }
);

export default podcastRouter;
