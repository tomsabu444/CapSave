    const express = require('express');
const router  = express.Router();
const verifyFirebaseToken = require('../middlewares/authMiddleware');
const uploadMediaToS3     = require('../utils/uploadMediaToS3');
const {
  createMedia,
  getMediaByAlbum,
  deleteMediaById,
} = require('../services/mediaService');

// All media routes require a valid Firebase ID token
router.use(verifyFirebaseToken);

/**
 * POST /api/v1/media
 *  - multipart field: "mediaFile"
 *  - body: { albumId }
 */
router.post(
  '/',
  uploadMediaToS3.single('mediaFile'),
  async (req, res, next) => {
    try {
      const { albumId } = req.body;
      const file        = req.file;
      const userId      = req.user.uid;

      if (!file)    return res.status(400).json({ error: 'mediaFile is required' });
      if (!albumId) return res.status(400).json({ error: 'albumId is required' });

      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'photo';
      const mediaUrl  = file.location; // multer-s3 provides this

      const media = await createMedia({ albumId, userId, mediaType, mediaUrl });
      res.status(201).json(media);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/v1/media/:albumId
 */
router.get('/:albumId', async (req, res, next) => {
  try {
    const items = await getMediaByAlbum(req.user.uid, req.params.albumId);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/media/:mediaId
 */
router.delete('/:mediaId', async (req, res, next) => {
  try {
    await deleteMediaById(req.user.uid, req.params.mediaId);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
