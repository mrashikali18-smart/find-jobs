const asyncHandler = require('express-async-handler');
const Connection = require('../models/Connection');
const User = require('../models/User');
const notify = require('../utils/notify');

const PUBLIC_FIELDS = 'name avatarUrl headline location role companyName connectionCount';

// @desc    Send a connection request
// @route   POST /api/connections/:userId
// @access  Private
const sendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot connect with yourself');
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  const existing = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: userId },
      { requester: userId, recipient: req.user._id },
    ],
  });
  if (existing) {
    res.status(409);
    throw new Error(`Connection already ${existing.status === 'pending' ? 'requested' : existing.status}`);
  }

  const connection = await Connection.create({ requester: req.user._id, recipient: userId });

  await notify({
    recipient: userId,
    sender: req.user._id,
    type: 'connection_request',
    message: `${req.user.name} wants to connect with you`,
    link: '/connections',
  });

  res.status(201).json({ success: true, connection });
});

// @desc    Respond to a connection request (accept/reject)
// @route   PUT /api/connections/:id/respond
// @access  Private (recipient only)
const respondToRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be accepted or rejected');
  }

  const connection = await Connection.findById(req.params.id);
  if (!connection) {
    res.status(404);
    throw new Error('Connection request not found');
  }
  if (connection.recipient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to respond to this request');
  }

  connection.status = status;
  await connection.save();

  if (status === 'accepted') {
    await User.findByIdAndUpdate(connection.requester, {
      $addToSet: { connections: connection.recipient },
      $inc: { connectionCount: 1 },
    });
    await User.findByIdAndUpdate(connection.recipient, {
      $addToSet: { connections: connection.requester },
      $inc: { connectionCount: 1 },
    });

    await notify({
      recipient: connection.requester,
      sender: req.user._id,
      type: 'connection_accepted',
      message: `${req.user.name} accepted your connection request`,
      link: `/profile/${req.user._id}`,
    });
  }

  res.status(200).json({ success: true, connection });
});

// @desc    Remove an existing connection
// @route   DELETE /api/connections/:userId
// @access  Private
const removeConnection = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await Connection.findOneAndDelete({
    status: 'accepted',
    $or: [
      { requester: req.user._id, recipient: userId },
      { requester: userId, recipient: req.user._id },
    ],
  });

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { connections: userId },
    $inc: { connectionCount: -1 },
  });
  await User.findByIdAndUpdate(userId, {
    $pull: { connections: req.user._id },
    $inc: { connectionCount: -1 },
  });

  res.status(200).json({ success: true, message: 'Connection removed' });
});

// @desc    Get the logged-in user's accepted connections
// @route   GET /api/connections/mine
// @access  Private
const getMyConnections = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('connections', PUBLIC_FIELDS);
  res.status(200).json({ success: true, connections: user.connections });
});

// @desc    Get pending incoming requests
// @route   GET /api/connections/pending
// @access  Private
const getPendingRequests = asyncHandler(async (req, res) => {
  const requests = await Connection.find({ recipient: req.user._id, status: 'pending' })
    .sort('-createdAt')
    .populate('requester', PUBLIC_FIELDS);

  res.status(200).json({ success: true, requests });
});

// @desc    Get connection status with a specific user (for profile "Connect" button)
// @route   GET /api/connections/status/:userId
// @access  Private
const getConnectionStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const connection = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: userId },
      { requester: userId, recipient: req.user._id },
    ],
  });

  if (!connection) {
    return res.status(200).json({ success: true, status: 'none' });
  }

  res.status(200).json({
    success: true,
    status: connection.status,
    connectionId: connection._id,
    isRequester: connection.requester.toString() === req.user._id.toString(),
  });
});

module.exports = {
  sendRequest,
  respondToRequest,
  removeConnection,
  getMyConnections,
  getPendingRequests,
  getConnectionStatus,
};
