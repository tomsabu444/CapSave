const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('✅ CapSave backend is running');
});

module.exports = router;