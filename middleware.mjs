import mongoose from "mongoose";
import MyCustomStorage from "./storage-engine.cjs";
import multer from "multer";

export function bucketUpload(bucketName, type) {
  return function (req, res, next) {
    try {
      //
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName,
      });
      const storageEngine = MyCustomStorage({ bucket });
      const upload = multer({ storage: storageEngine });
      return upload.single(type)(req, res, next);
    } catch (error) {
      //
      console.log("Error storing file:", error.message);
      return res.status(500).json({ error: error.message });
    }
  };
}
