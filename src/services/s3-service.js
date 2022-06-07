const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

require('dotenv').config();

const buncketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uplads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: buncketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;
// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParmas = {
    key: fileKey,
    Bucket: buncketName,
  };
  return s3.getObject(downloadParmas).createReadStream();
}
exports.getFileStream = getFileStream;
