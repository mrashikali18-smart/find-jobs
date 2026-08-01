const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Connection = require('../models/Connection');
const notify = require('../utils/notify');

const AUTHOR_FIELDS = 'name avatarUrl headline role companyName';

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { content, imageUrl, job } = req.body;
  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Post content cannot be empty');
  }

  const post = await Post.create({ author: req.user._id, content, imageUrl, job });
  await post.populate('author', AUTHOR_FIELDS);

  res.status(201).json({ success: true, post });
});

// @desc    Upload an image to attach to a post
// @route   POST /api/posts/upload-image
// @access  Private
const uploadPostImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please attach an image');
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, imageUrl });
});

// @desc    Get the home feed: posts from the user + their connections
// @route   GET /api/posts/feed
// @access  Private
const getFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const connections = await Connection.find({
    status: 'accepted',
    $or: [{ requester: req.user._id }, { recipient: req.user._id }],
  });

  const connectionIds = connections.map((c) =>
    String(c.requester) === String(req.user._id) ? c.recipient : c.requester
  );
  const authorIds = [req.user._id, ...connectionIds];

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 50);

  const [posts, total] = await Promise.all([
    Post.find({ author: { $in: authorIds } })
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('author', AUTHOR_FIELDS)
      .populate('comments.author', AUTHOR_FIELDS)
      .populate('job', 'title'),
    Post.countDocuments({ author: { $in: authorIds } }),
  ]);

  res.status(200).json({
    success: true,
    posts,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    total,
  });
});

// @desc    Get all posts by a specific user (for their profile page)
// @route   GET /api/posts/user/:userId
// @access  Public
const getPostsByUser = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.userId })
    .sort('-createdAt')
    .populate('author', AUTHOR_FIELDS)
    .populate('comments.author', AUTHOR_FIELDS);

  res.status(200).json({ success: true, posts });
});

// @desc    Delete own post
// @route   DELETE /api/posts/:id
// @access  Private (author only)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }
  await post.deleteOne();
  res.status(200).json({ success: true, message: 'Post deleted' });
});

// @desc    Toggle like on a post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const alreadyLiked = post.likes.some((id) => id.toString() === req.user._id.toString());
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
    await notify({
      recipient: post.author,
      sender: req.user._id,
      type: 'post_like',
      message: `${req.user.name} liked your post`,
      link: `/feed`,
    });
  }
  await post.save();

  res.status(200).json({ success: true, likes: post.likes });
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Comment cannot be empty');
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.comments.push({ author: req.user._id, text });
  await post.save();
  await post.populate('comments.author', AUTHOR_FIELDS);

  await notify({
    recipient: post.author,
    sender: req.user._id,
    type: 'post_comment',
    message: `${req.user.name} commented on your post`,
    link: `/feed`,
  });

  res.status(201).json({ success: true, comments: post.comments });
});

module.exports = {
  createPost,
  uploadPostImage,
  getFeed,
  getPostsByUser,
  deletePost,
  toggleLike,
  addComment,
};
