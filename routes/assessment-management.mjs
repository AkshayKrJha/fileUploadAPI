import express from "express";
import { Mongoose } from "mongoose";
import { mongooseDB } from "../database/db.cjs";
import { bucketUpload } from "../middlewares/middleware.mjs";
const assessmentRouter = express.Router();

assessmentRouter.post(
  "/",
  bucketUpload("assessment", "assessment"),
  async (req, res) => {
    // create
    console.log("File data:", req.file);
    res.json({
      message: "File uploaded successfully",
      fileID: req.file.fileID,
    });
  }
);

export default assessmentRouter;
