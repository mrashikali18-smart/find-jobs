const Notification = require('../models/Notification');

/**
 * Creates a notification. Never throws — notification failures should
 * never break the primary action (e.g. liking a post still succeeds
 * even if the notification write fails).
 */
const notify = async ({ recipient, sender, type, message, link }) => {
  try {
    if (String(recipient) === String(sender)) return; // don't notify yourself
    await Notification.create({ recipient, sender, type, message, link });
  } catch (err) {
    console.error('Notification creation failed:', err.message);
  }
};

module.exports = notify;
