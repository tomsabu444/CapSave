const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('✅ CapSave backend is runnings');
});

module.exports = router;
  