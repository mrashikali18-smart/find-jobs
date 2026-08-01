const express = require('express');
const { protect } = require('../middleware/auth');
const {
  sendRequest,
  respondToRequest,
  removeConnection,
  getMyConnections,
  getPendingRequests,
  getConnectionStatus,
} = require('../controllers/connectionController');

const router = express.Router();

router.use(protect);

router.get('/mine', getMyConnections);
router.get('/pending', getPendingRequests);
router.get('/status/:userId', getConnectionStatus);
router.post('/:userId', sendRequest);
router.put('/:id/respond', respondToRequest);
router.delete('/:userId', removeConnection);

module.exports = router;
