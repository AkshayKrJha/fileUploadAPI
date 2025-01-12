var fs = require("fs");

function getDestination(req, file, cb) {
  cb(null, "/dev/null");
}

class MyCustomStorage {
  constructor(opts) {
    console.log("Options:", opts);
    this.getDestination = opts.destination || getDestination;
    this.bucket = opts.bucket;
  }
  _handleFile(req, file, cb) {
    let bucket = this.bucket;
    this.getDestination(req, file, function (err, path) {
      if (err) return cb(err);

      /* var outStream = fs.createWriteStream(path)

      file.stream.pipe(outStream)
      outStream.on('error', cb)
      outStream.on('finish', function () {
          // save to mongodb gridfs
          cb(null, {
              path: path,
              size: outStream.bytesWritten
          })
      }) */

      //   give the bucket as input here
      try {
        var gridFileStream = bucket.openUploadStream(
          `${+new Date()}_${file.originalname}`
        );
        file.stream.pipe(/* outStream */ gridFileStream);
        gridFileStream.on("error", cb);
        //   this.id = gridFileStream.id;
        gridFileStream.on("finish", function () {
          console.log("========GFS========", gridFileStream);
          cb(null, {
            fileID: gridFileStream.id,
          });
        });
      } catch (error) {
        console.log(">>>>>>>Error storing file<<<<<<<\n", error.message);
        
      }
        // console.log("GFS ID:", this.id);

      //   store in gridfs and get its id
    });
  }
  _removeFile(req, file, cb) {
    // fs.unlink(file.path, cb);
    // try removing the file from gridfs
    // fetch file id from file object or request object
    this.bucket.delete(/* this.id */ file.fileID, function (err) {
      if (err) {
        console.log("Error deleting file from GridFS", err);
        return cb(err);
      }
      cb(null);
    });
  }
}

module.exports = function (opts) {
  return new MyCustomStorage(opts);
};
