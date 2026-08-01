const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'connection_request',
        'connection_accepted',
        'post_like',
        'post_comment',
        'application_status',
        'new_applicant',
        'new_message',
      ],
      required: true,
    },
    message: { type: String, required: true },
    link: { type: String }, // frontend route to navigate to on click
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
