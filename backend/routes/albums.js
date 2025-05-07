// backend/routes/albums.js
const express = require('express');
const Album = require('../models/Album');
const Media = require('../models/Media');
const { deleteMediaFromS3 } = require('../utils/deleteMediaFromS3');
const getSignedUrlFromS3 = require('../utils/getSignedUrlFromS3');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

/**
 * GET /api/v1/albums
 * List all albums for the logged-in user, including:
 *  - albumId
 *  - albumName
 *  - count (number of media items)
 *  - createdAt
 *  - updatedAt
 *  - coverUrl (signed URL of the most recent media in the album)
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.uid;

    // fetch albums
    const albums = await Album.find({ userId }).sort('-updatedAt').select('_id albumName createdAt updatedAt');

    // aggregate counts per albumId
    const counts = await Media.aggregate([
      { $match: { userId } },
      { $group: { _id: '$albumId', count: { $sum: 1 } } }
    ]);
    const countMap = counts.reduce((map, { _id, count }) => {
      map[_id.toString()] = count;
      return map;
    }, {});

    // aggregate most recent mediaUrl per albumId
    const covers = await Media.aggregate([
      { $match: { userId } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$albumId', coverUrl: { $first: '$mediaUrl' } } }
    ]);
    const coverMap = covers.reduce((map, { _id, coverUrl }) => {
      map[_id.toString()] = coverUrl;
      return map;
    }, {});

    // build trimmed response with signed cover URLs
    const result = await Promise.all(albums.map(async album => {
      const id = album._id.toString();
      const unsigned = coverMap[id] || null;
      const signedCoverUrl = unsigned
        ? await getSignedUrlFromS3(unsigned)
        : null;

      return {
        albumId:   id,
        albumName: album.albumName,
        count:     countMap[id] || 0,
        createdAt: album.createdAt,
        updatedAt: album.updatedAt,
        coverUrl:  signedCoverUrl,
      };
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
router.post('/', async (req, res) => {
  try {
    const { albumName } = req.body;
    if (!albumName?.trim()) {
      return res.status(400).json({ error: 'albumName is required' });
    }
    const album = await Album.create({
      albumName: albumName.trim(),
      userId:    req.user.uid,
    });
    res.status(201).json({
      albumId:   album._id.toString(),
      albumName: album.albumName,
      count:     0,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
      coverUrl:  null,
    });
  } catch (err) {
    console.error('createAlbum error', err);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

/**
 * PUT /api/v1/albums/:albumId
 * Rename an existing album
 */
router.put('/:albumId', async (req, res) => {
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

    // recalc count
    const count = await Media.countDocuments({ userId: req.user.uid, albumId });

    // fetch latest mediaUrl and sign it
    const latest = await Media.findOne({ userId: req.user.uid, albumId })
      .sort('-createdAt')
      .select('mediaUrl')
      .lean();
    const signedCoverUrl = latest
      ? await getSignedUrlFromS3(latest.mediaUrl)
      : null;

    res.json({
      albumId:   album._id.toString(),
      albumName: album.albumName,
      count,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
      coverUrl:  signedCoverUrl,
    });
  } catch (err) {
    console.error('updateAlbum error', err);
    res.status(500).json({ error: 'Failed to rename album' });
  }
});

/**
 * DELETE /api/v1/albums/:albumId
 * Delete an album and all its associated media
 */
router.delete('/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const userId = req.user.uid;

    const album = await Album.findOne({ _id: albumId, userId });
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const mediaItems = await Media.find({ albumId, userId });
    const urls = mediaItems.map(m => m.mediaUrl);
    if (urls.length) {
      await deleteMediaFromS3(urls);
    }
    await Media.deleteMany({ albumId, userId });
    await Album.deleteOne({ _id: albumId, userId });

    res.json({ albumId });
  } catch (err) {
    console.error('deleteAlbum error', err);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

module.exports = router;
