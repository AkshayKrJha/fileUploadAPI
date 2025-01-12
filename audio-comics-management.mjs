import express from "express";
import { Mongoose } from "mongoose";
import { mongooseDB } from "./database/db.cjs";
import { bucketUpload } from "./middleware.mjs";
const audioComicsRouter = express.Router();

audioComicsRouter.post(
  "/",
  bucketUpload("audioComics", "audioComics"),
  async (req, res) => {
    console.log("File data:", req.file);
    res.json({
      message: "File uploaded successfully",
      fileID: req.file.fileID,
    });
  }
);

export default audioComicsRouter;
