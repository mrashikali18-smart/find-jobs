const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const notify = require('../utils/notify');

const PARTICIPANT_FIELDS = 'name avatarUrl headline role';

// @desc    Get (or lazily create) a conversation with another user, then start/open chat
// @route   POST /api/messages/conversations/:userId
// @access  Private
const startConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, userId], $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [req.user._id, userId] });
  }

  await conversation.populate('participants', PARTICIPANT_FIELDS);
  res.status(200).json({ success: true, conversation });
});

// @desc    Get all conversations for the logged-in user, sorted by most recent
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .sort('-lastMessageAt')
    .populate('participants', PARTICIPANT_FIELDS);

  res.status(200).json({ success: true, conversations });
});

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversations/:conversationId/messages
// @access  Private (participant only)
const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  if (!conversation.participants.some((p) => p.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to view this conversation');
  }

  const messages = await Message.find({ conversation: req.params.conversationId })
    .sort('createdAt')
    .populate('sender', PARTICIPANT_FIELDS);

  // Mark messages as read by the current user
  await Message.updateMany(
    { conversation: req.params.conversationId, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );

  res.status(200).json({ success: true, messages });
});

// @desc    Send a message in a conversation
// @route   POST /api/messages/conversations/:conversationId/messages
// @access  Private (participant only)
const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Message cannot be empty');
  }

  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  if (!conversation.participants.some((p) => p.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to message in this conversation');
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text,
    readBy: [req.user._id],
  });
  await message.populate('sender', PARTICIPANT_FIELDS);

  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const recipientId = conversation.participants.find(
    (p) => p.toString() !== req.user._id.toString()
  );
  await notify({
    recipient: recipientId,
    sender: req.user._id,
    type: 'new_message',
    message: `${req.user.name} sent you a message`,
    link: `/messages/${conversation._id}`,
  });

  res.status(201).json({ success: true, message });
});

module.exports = { startConversation, getConversations, getMessages, sendMessage };
