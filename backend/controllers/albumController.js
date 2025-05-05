const Album = require('../models/Album');

/**
 * GET /api/v1/albums
 * List all albums for the logged-in user
 */
exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album
      .find({ userId: req.user.uid })
      .sort('-updatedAt');
    res.json(albums);
  } catch (err) {
    console.error('getAlbums error', err);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
};

/**
 * POST /api/v1/albums
 * Create a new album
 */
exports.createAlbum = async (req, res) => {
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
};

/**
 * PUT /api/v1/albums/:albumId
 * Rename an existing album
 */
exports.updateAlbum = async (req, res) => {
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
};

/**
 * DELETE /api/v1/albums/:albumId
 * Delete an album (and its media)
 */
exports.deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findOneAndDelete({
      _id: albumId,
      userId: req.user.uid,
    });
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    //! TODO: also delete associated media from your storage provider
    res.json({ message: 'Album deleted' });
  } catch (err) {
    console.error('deleteAlbum error', err);
    res.status(500).json({ error: 'Failed to delete album' });
  }
};
