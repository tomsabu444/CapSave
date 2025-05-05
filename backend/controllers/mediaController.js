// backend/controllers/mediaController.js
const Media = require('../models/Media');
const uploadMediaToS3 = require('../utils/uploadMediaToS3');
const { deleteMediaFromS3 } = require('../utils/deleteMediaFromS3');

/**
 * POST /api/v1/media
 *  - multipart field name: "mediaFile"
 *  - body: { albumId }
 */
exports.uploadMedia = [
  uploadMediaToS3.single('mediaFile'),

  async function (req, res, next) {
    try {
      const { albumId } = req.body;
      const file        = req.file;
      const userId      = req.user.uid;

      if (!file) {
        return res.status(400).json({ error: 'mediaFile is required' });
      }
      if (!albumId) {
        return res.status(400).json({ error: 'albumId is required' });
      }

      // multer-s3 stores the file and exposes its URL on `file.location`
      const mediaUrl  = file.location;
      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'photo';

      const media = await Media.create({
        albumId,
        userId,
        mediaType,
        mediaUrl,
      });

      res.status(201).json(media);
    } catch (err) {
      next(err);
    }
  },
];

/**
 * GET /api/v1/media/:albumId
 */
exports.getMediaByAlbum = async function (req, res, next) {
  try {
    const { albumId } = req.params;
    const userId      = req.user.uid;

    const items = await Media
      .find({ albumId, userId })
      .sort('-createdAt');

    res.json(items);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/media/:mediaId
 */
exports.deleteMedia = async function (req, res, next) {
  try {
    const { mediaId } = req.params;
    const userId      = req.user.uid;

    // 1️⃣ Find the media record
    const media = await Media.findOne({ _id: mediaId, userId });
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // 2️⃣ Delete the S3 object
    await deleteMediaFromS3(media.mediaUrl);

    // 3️⃣ Remove the MongoDB document
    await media.deleteOne();

    res.json({ message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
};
