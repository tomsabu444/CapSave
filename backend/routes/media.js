const express = require('express');
const Media = require('../models/Media');
const uploadMediaToS3 = require('../utils/uploadMediaToS3');
const { deleteMediaFromS3 } = require('../utils/deleteMediaFromS3');
const getSignedUrlFromS3 = require('../utils/getSignedUrlFromS3');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware to verify Firebase token
router.use(verifyFirebaseToken);

/**
 * POST /api/v1/media
 *   - multipart field: "mediaFile"
 *   - body: { albumId }
 */
router.post(
  '/',
  uploadMediaToS3.single('mediaFile'),
  async (req, res, next) => {
    try {
      const { albumId } = req.body;
      const file = req.file;
      const userId = req.user.uid;

      if (!file) return res.status(400).json({ error: 'mediaFile is required' });
      if (!albumId) return res.status(400).json({ error: 'albumId is required' });

      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'photo';
      const mediaUrl = file.location;

      const media = await Media.create({ albumId, userId, mediaType, mediaUrl });
      res.status(201).json(media);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/v1/media/:albumId
 * Returns media items with signed URLs
 */
router.get('/:albumId', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const albumId = req.params.albumId;

    const items = await Media.find({ userId, albumId }).sort('-createdAt');

    const itemsWithSignedUrls = await Promise.all(
      items.map(async (item) => {
        try {
          const signedUrl = await getSignedUrlFromS3(item.mediaUrl);
          return {
            ...item.toObject(),
            mediaUrl: signedUrl,
          };
        } catch (err) {
          console.error('Failed to generate signed URL:', err.message);
          return item.toObject(); // Fallback to original
        }
      })
    );

    res.json(itemsWithSignedUrls);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/media/:mediaId
 */
router.delete('/:mediaId', async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const mediaId = req.params.mediaId;

    const media = await Media.findOne({ _id: mediaId, userId });
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    await deleteMediaFromS3(media.mediaUrl);
    await media.deleteOne();

    res.json({ message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
