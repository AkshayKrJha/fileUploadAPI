import express from "express";
import { Mongoose } from "mongoose";
import { mongooseDB } from "../database/db.cjs";
import { bucketUpload } from "../middleware.mjs";
const comicsRouter = express.Router();

comicsRouter.post("/", bucketUpload("comics", "comics"), async (req, res) => {
  // create
  console.log("File data:", req.file);
  res.json({ message: "File uploaded successfully", fileID: req.file.fileID });
});

export default comicsRouter;
