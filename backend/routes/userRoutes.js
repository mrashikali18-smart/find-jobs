const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  updateProfile,
  uploadResume,
  getDashboard,
  getPublicProfile,
  importLinkedInProfile,
  getSuggestions,
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.post('/import-linkedin', importLinkedInProfile);
router.get('/dashboard', getDashboard);
router.get('/suggestions', getSuggestions);
router.get('/:id', getPublicProfile);

module.exports = router;
