const express = require('express');
const { protect } = require('../middleware/auth');
const {
  startConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations/:userId', startConversation);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);

module.exports = router;
