const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middlewares/authMiddleware');
const {
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} = require('../controllers/albumController');

// Protect all album routes
router.use(verifyFirebaseToken);

router
  .route('/')
  .get(getAlbums)      // GET    /api/v1/albums
  .post(createAlbum);  // POST   /api/v1/albums

router
  .route('/:albumId')
  .put(updateAlbum)    // PUT    /api/v1/albums/:albumId
  .delete(deleteAlbum);// DELETE /api/v1/albums/:albumId

module.exports = router;
