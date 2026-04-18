const express = require('express');
const router = express.Router();
const { getItemByQR } = require('../controllers/qrController');

// Public route - no auth required
router.get('/:qrCodeId', getItemByQR);

module.exports = router;
