const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');
const { validateMessage } = require('../middleware/validation');

// Protected routes
router.post('/', auth, validateMessage, messageController.sendMessage);
router.get('/conversations', auth, messageController.getConversations);
router.get('/conversation/:userId', auth, messageController.getConversation);
router.put('/read/:senderId', auth, messageController.markAsRead);
router.get('/unread-count', auth, messageController.getUnreadCount);

module.exports = router; 