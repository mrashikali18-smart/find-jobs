const express = require('express');
const { protect } = require('../middleware/auth');
const { globalSearch } = require('../controllers/searchController');

const router = express.Router();

router.get('/', protect, globalSearch);

module.exports = router;
