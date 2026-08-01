const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (jobseeker)
const applyToJob = asyncHandler(async (req, res) => {
  // SECURITY: Validate user is a jobseeker
  if (req.user.role !== 'jobseeker') {
    res.status(403);
    throw new Error('Only jobseekers can apply for jobs');
  }

  const { jobId } = req.params;
  const { coverLetter, resumeUrl } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.status !== 'open') {
    res.status(400);
    throw new Error('This job is no longer accepting applications');
  }

  const resume = resumeUrl || req.user.resumeUrl;
  if (!resume) {
    res.status(400);
    throw new Error('Please upload a resume before applying');
  }

  // SECURITY: Use unique constraint to prevent race conditions
  let application;
  try {
    application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      recruiter: job.recruiter,
      resumeUrl: resume,
      coverLetter,
    });
  } catch (err) {
    // Check for duplicate key error (E11000) - means already applied
    if (err.code === 11000) {
      res.status(409);
      throw new Error('You have already applied to this job');
    }
    throw err;
  }

  job.applicantCount += 1;
  await job.save();

  res.status(201).json({ success: true, application });
});

// @desc    Get the logged-in jobseeker's applications
// @route   GET /api/applications/mine
// @access  Private (jobseeker)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .sort('-createdAt')
    .populate({
      path: 'job',
      populate: { path: 'company', select: 'name logoUrl location' },
    });

  res.status(200).json({ success: true, count: applications.length, applications });
});

// @desc    Withdraw (delete) a pending application
// @route   DELETE /api/applications/:id
// @access  Private (jobseeker, owner only)
const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (application.applicant.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to withdraw this application');
  }

  await application.deleteOne();
  await Job.findByIdAndUpdate(application.job, { $inc: { applicantCount: -1 } });

  res.status(200).json({ success: true, message: 'Application withdrawn' });
});

// @desc    Get all applicants for a specific job (recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (recruiter, owner only)
const getApplicantsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view applicants for this job');
  }

  const applications = await Application.find({ job: req.params.jobId })
    .sort('-createdAt')
    .populate('applicant', 'name email phone location skills resumeUrl avatarUrl headline');

  res.status(200).json({ success: true, count: applications.length, applications });
});

// @desc    Update an applicant's status (reviewed/shortlisted/rejected/hired)
// @route   PUT /api/applications/:id/status
// @access  Private (recruiter, owner only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const validStatuses = ['applied', 'reviewed', 'shortlisted', 'rejected', 'hired'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (application.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  application.status = status;
  if (notes !== undefined) application.notes = notes;
  await application.save();

  res.status(200).json({ success: true, application });
});

module.exports = {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicantsForJob,
  updateApplicationStatus,
};
