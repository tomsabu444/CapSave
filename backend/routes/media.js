const express = require('express');
const Media = require('../models/Media');
const Album = require('../models/Album'); // ✅ Needed to check if album exists
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

      const albumExists = await Album.exists({ _id: albumId, userId });
      if (!albumExists) {
        return res.status(404).json({ error: 'Album not found' });
      }

      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'photo';
      const mediaUrl = file.location;

      const media = await Media.create({ albumId, userId, mediaType, mediaUrl });

      const signedUrl = await getSignedUrlFromS3(media.mediaUrl);

      res.status(201).json({
        mediaId: media._id.toString(),
        mediaType: media.mediaType,
        mediaUrl: signedUrl,
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload media' });
    }
  }
);

/**
 * GET /api/v1/media/:albumId
 * Returns media items with signed URLs
 */
router.get('/:albumId', async (req, res) => {
  try {
    const userId = req.user.uid;
    const albumId = req.params.albumId;

    const albumExists = await Album.exists({ _id: albumId, userId });
    if (!albumExists) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const items = await Media.find({ userId, albumId })
      .sort('-createdAt')
      .select('_id mediaType mediaUrl');

    const sanitizedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const signedUrl = await getSignedUrlFromS3(item.mediaUrl);
          return {
            mediaId: item._id.toString(),
            mediaType: item.mediaType,
            mediaUrl: signedUrl,
          };
        } catch (err) {
          console.error('Failed to sign media URL:', err.message);
          return {
            mediaId: item._id.toString(),
            mediaType: item.mediaType,
            mediaUrl: item.mediaUrl,
          };
        }
      })
    );

    res.json(sanitizedItems);
  } catch (err) {
    console.error('Get media error:', err);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

/**
 * DELETE /api/v1/media/:mediaId
 */
router.delete('/:mediaId', async (req, res) => {
  try {
    const userId = req.user.uid;
    const mediaId = req.params.mediaId;

    const media = await Media.findOne({ _id: mediaId, userId });
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    try {
      await deleteMediaFromS3(media.mediaUrl);
    } catch (s3err) {
      console.error('S3 delete failed:', s3err.message);
      // Still attempt DB delete
    }

    await media.deleteOne();

    res.json({ message: 'Media deleted' });
  } catch (err) {
    console.error('Delete media error:', err);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

module.exports = router;
