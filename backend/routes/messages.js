const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, replyMessage } = require('../controllers/messagesController');
const { protect } = require('../middleware/auth');

// Public - finder can send message without login
router.post('/', sendMessage);

// Protected - only owner can view messages and reply
router.get('/:itemId', protect, getMessages);
router.post('/reply', protect, replyMessage);

module.exports = router;
