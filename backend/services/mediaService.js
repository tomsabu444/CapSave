const Media = require('../models/Media');
const { deleteImagesFromS3 } = require('../utils/deleteImagesFromS3');

/**
 * Persist a new media record.
 */
async function createMedia({ albumId, userId, mediaType, mediaUrl }) {
  return Media.create({ albumId, userId, mediaType, mediaUrl });
}

/**
 * Fetch all media items for a given user and album.
 */
async function getMediaByAlbum(userId, albumId) {
  return Media.find({ userId, albumId }).sort('-createdAt');
}

/**
 * Delete both the S3 object(s) and the MongoDB record.
 */
async function deleteMediaById(userId, mediaId) {
  const media = await Media.findOne({ _id: mediaId, userId });
  if (!media) {
    const err = new Error('Media not found');
    err.status = 404;
    throw err;
  }

  await deleteImagesFromS3(media.mediaUrl);
  await media.deleteOne();
}

module.exports = {
  createMedia,
  getMediaByAlbum,
  deleteMediaById,
};
