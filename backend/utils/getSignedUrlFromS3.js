// utils/getSignedUrlFromS3.js
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, BUCKET_NAME } = require("../config/s3Client");

async function getSignedUrlFromS3(mediaUrl, expiresInSeconds = 3600) {
  // Extract S3 object key from URL
  const key = mediaUrl.split(".amazonaws.com/")[1];

  if (!key) throw new Error("Invalid media URL, could not extract S3 key");

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  return signedUrl;
}

module.exports = getSignedUrlFromS3;
