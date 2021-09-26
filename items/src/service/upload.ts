import AWS from "aws-sdk";

import fs from "fs";
AWS.config.update({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
  apiVersion: "latest",
});

const s3 = new AWS.S3();

export const upload = async (file: Express.Multer.File) => {
  const filestream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: file.filename,
    Body: filestream,
  };
  return s3.upload(uploadParams).promise();
};
