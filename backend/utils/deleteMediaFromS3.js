const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3, BUCKET_NAME }     = require('../config/s3Client');

/**
 * Extracts the S3 object key from a public S3 URL.
 *
 * @param {string} url – e.g. "https://my-bucket.s3.us-east-1.amazonaws.com/userId/2025-05-10/12345.jpg"
 * @returns {string} – e.g. "userId/2025-05-10/12345.jpg"
 */
function parseS3KeyFromUrl(url) {
  try {
    return new URL(url).pathname.slice(1);
  } catch {
    throw new Error(`Invalid S3 URL: ${url}`);
  }
}

/**
 * Deletes one or more objects from S3 given their public URLs.
 *
 * @param {string|string[]} urls – a single URL or an array of URLs to delete
 * @returns {Promise<void>}
 */
async function deleteImagesFromS3(urls) {
  const list = Array.isArray(urls) ? urls : [urls];
  const commands = list.map((url) => {
    const Key = parseS3KeyFromUrl(url);
    return new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key });
  });

  // send all delete commands in parallel
  await Promise.all(commands.map(cmd => s3.send(cmd)));
}

module.exports = { deleteImagesFromS3 };
