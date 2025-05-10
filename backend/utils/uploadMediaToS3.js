const { s3, BUCKET_NAME } = require("../config/s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const crypto = require("crypto");

module.exports = async function uploadToS3(
  buffer,
  { userId, mimeType, originalName }
) {
  const ext = path.extname(originalName) || "";
  const date = new Date().toISOString().slice(0, 10);
  const hashedUserId = crypto.createHash("sha256").update(userId).digest("hex");
  const key = `${hashedUserId}/${date}/${Date.now()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  try {
    await s3.send(command);
  } catch (err) {
    console.error("S3 Upload failed:", err);
    throw new Error("S3 upload failed");
  }

  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
