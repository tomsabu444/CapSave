const multer    = require('multer');
const multerS3  = require('multer-s3');
const path      = require('path');
const crypto    = require('crypto');
const { s3, BUCKET_NAME } = require('../config/s3Client');

/**
 * Generates an S3 key: hashedUserId/YYYY-MM-DD_timestamp.ext
 */
function buildS3Key(req, file, cb) {
  const ext = path.extname(file.originalname);
  const date = new Date().toISOString().slice(0, 10);
  const userId = req.user.uid;

  // ✅ Obfuscate the userId
  const obfuscatedUserId = crypto.createHash('sha256').update(userId).digest('hex');

  const key = `${obfuscatedUserId}/${date}/${Date.now()}${ext}`;
  cb(null, key);
}

const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: buildS3Key,
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

module.exports = uploadS3;
