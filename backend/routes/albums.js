// backend/routes/albums.js
const express = require('express');
const Album = require('../models/Album');
const Media = require('../models/Media');
const { deleteMediaFromS3 } = require('../utils/deleteMediaFromS3');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

/**
 * GET /api/v1/albums
 * List all albums for the logged-in user
 */
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.uid;

    // fetch albums
    const albums = await Album
      .find({ userId })
      .sort('-updatedAt');

    // count media per albumId
    const counts = await Media.aggregate([
      { $match: { userId } },
      { $group: { _id: '$albumId', count: { $sum: 1 } } }
    ]);
    const countMap = counts.reduce((map, { _id, count }) => {
      map[_id.toString()] = count;
      return map;
    }, {});

    // build trimmed response
    const result = albums.map(album => ({
      albumId:   album._id.toString(),
      albumName: album.albumName,
      count:     countMap[album._id.toString()] || 0,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error('getAlbums error', err);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

/**
 * POST /api/v1/albums
 * Create a new album
 */
router.post('/', async (req, res, next) => {
  try {
    const { albumName } = req.body;
    if (!albumName?.trim()) {
      return res.status(400).json({ error: 'albumName is required' });
    }
    const album = await Album.create({
      albumName: albumName.trim(),
      userId:    req.user.uid,
    });
    res.status(201).json(album);
  } catch (err) {
    console.error('createAlbum error', err);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

/**
 * PUT /api/v1/albums/:albumId
 * Rename an existing album
 */
router.put('/:albumId', async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { albumName } = req.body;
    if (!albumName?.trim()) {
      return res.status(400).json({ error: 'albumName is required' });
    }
    const album = await Album.findOneAndUpdate(
      { _id: albumId, userId: req.user.uid },
      { albumName: albumName.trim() },
      { new: true }
    );
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (err) {
    console.error('updateAlbum error', err);
    res.status(500).json({ error: 'Failed to rename album' });
  }
});

/**
 * DELETE /api/v1/albums/:albumId
 * Delete an album and all its associated media
 */
router.delete('/:albumId', async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const userId = req.user.uid;

    // ensure album exists
    const album = await Album.findOne({ _id: albumId, userId });
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // delete all media in this album
    const mediaItems = await Media.find({ albumId, userId });
    const urls = mediaItems.map(m => m.mediaUrl);
    if (urls.length) {
      await deleteMediaFromS3(urls);
    }
    await Media.deleteMany({ albumId, userId });

    // delete the album itself
    await Album.deleteOne({ _id: albumId, userId });

    res.json({ message: 'Album and its media deleted' });
  } catch (err) {
    console.error('deleteAlbum error', err);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

module.exports = router;
