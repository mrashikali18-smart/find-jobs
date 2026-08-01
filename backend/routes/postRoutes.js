const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createPost,
  uploadPostImage,
  getFeed,
  getPostsByUser,
  deletePost,
  toggleLike,
  addComment,
} = require('../controllers/postController');

const router = express.Router();

router.get('/feed', protect, getFeed);
router.get('/user/:userId', getPostsByUser);
router.post('/upload-image', protect, upload.single('image'), uploadPostImage);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

module.exports = router;
