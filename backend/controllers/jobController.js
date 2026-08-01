const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get all jobs with search, filter, sort, pagination
// @route   GET /api/jobs
// @access  Public
// Query params: keyword, location, category, jobType, experienceLevel,
//               salaryMin, salaryMax, sort, page, limit
const getJobs = asyncHandler(async (req, res) => {
  const {
    keyword,
    location,
    category,
    jobType,
    experienceLevel,
    skills,
    salaryMin,
    salaryMax,
    sort = '-createdAt',
    page = 1,
    limit = 10,
  } = req.query;

  const query = { status: 'open' };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  if (category) {
    query.category = { $regex: `^${category}$`, $options: 'i' };
  }
  if (jobType) {
    query.jobType = jobType;
  }
  if (experienceLevel) {
    query.experienceLevel = experienceLevel;
  }
  if (skills) {
    // SECURITY: Use exact string matching instead of regex to prevent ReDoS
    const skillsArray = skills.split(',').map((s) => s.trim().toLowerCase());
    query.skills = { $in: skillsArray };
  }
  if (salaryMin) {
    // Job's upper pay range must meet the seeker's minimum ask
    query.salaryMax = { ...query.salaryMax, $gte: Number(salaryMin) };
  }
  if (salaryMax) {
    // Job's lower pay range must not exceed the seeker's budget ceiling
    query.salaryMin = { ...query.salaryMin, $lte: Number(salaryMax) };
  }

  // SECURITY: Prevent DoS via huge skip values
  const pageNum = Math.min(Math.max(Number(page), 1), 10000);
  const limitNum = Math.min(Math.max(Number(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate('company', 'name logoUrl location')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Job.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: jobs.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    jobs,
  });
});

// @desc    Get single job by ID (increments view count)
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate('company', 'name logoUrl location website description industry hrContact');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.status(200).json({ success: true, job });
});

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private (recruiter)
const createJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(400);
    throw new Error('Please create your company profile before posting a job');
  }

  const job = await Job.create({
    ...req.body,
    company: company._id,
    recruiter: req.user._id,
  });

  res.status(201).json({ success: true, job });
});

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (recruiter, owner only)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  Object.assign(job, req.body);
  await job.save();

  res.status(200).json({ success: true, job });
});

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (recruiter, owner only)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await Application.deleteMany({ job: job._id });
  await job.deleteOne();

  res.status(200).json({ success: true, message: 'Job deleted successfully' });
});

// @desc    Get all jobs posted by the logged-in recruiter
// @route   GET /api/jobs/recruiter/mine
// @access  Private (recruiter)
const getMyPostedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id })
    .populate('company', 'name logoUrl')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: jobs.length, jobs });
});

// @desc    Get distinct job categories (for filter dropdowns)
// @route   GET /api/jobs/meta/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Job.distinct('category', { status: 'open' });
  res.status(200).json({ success: true, categories });
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
  getCategories,
};
