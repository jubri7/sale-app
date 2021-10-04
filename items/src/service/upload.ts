import AWS from "aws-sdk";
import fs from "fs";
import util from "util";

AWS.config.update({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
  apiVersion: "latest",
});

const s3 = new AWS.S3();

export class UploadImage {
  static async upload(file: Express.Multer.File) {
    const filestream = fs.createReadStream(file.path);
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: file.filename,
      Body: filestream,
    };
    return (await s3.upload(uploadParams).promise()).Location;
  }
  static unlinkFile(path: fs.PathLike) {
    const remove = util.promisify(fs.unlink);
    return remove(path);
  }
}
