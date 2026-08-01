const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Global search across people, jobs, and companies
// @route   GET /api/search?q=keyword&type=all|people|jobs|companies
// @access  Private
const globalSearch = asyncHandler(async (req, res) => {
  const { q, type = 'all' } = req.query;

  if (!q || !q.trim()) {
    res.status(400);
    throw new Error('A search query is required');
  }

  // SECURITY: Escape regex special characters to prevent ReDoS vulnerability
  const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'i');
  const results = {};

  if (type === 'all' || type === 'people') {
    results.people = await User.find({
      _id: { $ne: req.user._id },
      isActive: true,
      $or: [{ name: regex }, { headline: regex }, { skills: regex }],
    })
      .select('name avatarUrl headline location role companyName connectionCount')
      .limit(10);
  }

  if (type === 'all' || type === 'jobs') {
    results.jobs = await Job.find({
      status: 'open',
      $or: [{ title: regex }, { skills: regex }, { category: regex }],
    })
      .populate('company', 'name logoUrl')
      .limit(10);
  }

  if (type === 'all' || type === 'companies') {
    results.companies = await Company.find({
      $or: [{ name: regex }, { industry: regex }],
    }).limit(10);
  }

  res.status(200).json({ success: true, results });
});

module.exports = { globalSearch };
