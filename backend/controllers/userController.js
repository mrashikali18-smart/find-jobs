const asyncHandler = require('express-async-handler');
const path = require('path');
const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name',
    'phone',
    'location',
    'headline',
    'bio',
    'skills',
    'experience',
    'education',
    'jobPreferences',
  ];

  // SECURITY: Only recruiters can update company fields
  if (req.user.role === 'recruiter') {
    allowedFields.push('companyName', 'companyWebsite', 'companyDescription');
  }

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user: user.toPublicJSON() });
});

// @desc    Upload resume (jobseeker) or avatar
// @route   POST /api/users/upload-resume
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please attach a file');
  }

  const user = await User.findById(req.user._id);
  
  // SECURITY: Delete old resume file to prevent storage leak
  if (user.resumeUrl) {
    try {
      const fs = require('fs').promises;
      const oldPath = path.join(__dirname, '..', 'uploads', path.basename(user.resumeUrl));
      await fs.unlink(oldPath).catch(() => {}); // Ignore if file not found
    } catch (err) {
      console.error('Error deleting old resume:', err.message);
      // Don't fail the upload if cleanup fails
    }
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  user.resumeUrl = fileUrl;
  await user.save();

  res.status(200).json({ success: true, resumeUrl: fileUrl, user: user.toPublicJSON() });
});

// @desc    Get dashboard stats for the logged-in user
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  if (req.user.role === 'recruiter') {
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });
    const openJobs = jobs.filter((j) => j.status === 'open').length;
    const recentApplications = await Application.find({ job: { $in: jobIds } })
      .sort('-createdAt')
      .limit(5)
      .populate('applicant', 'name email avatarUrl')
      .populate('job', 'title');

    return res.status(200).json({
      success: true,
      stats: {
        totalJobsPosted: jobs.length,
        openJobs,
        totalApplicants,
      },
      recentActivity: recentApplications,
    });
  }

  // jobseeker
  const applications = await Application.find({ applicant: req.user._id })
    .sort('-createdAt')
    .populate({ path: 'job', populate: { path: 'company', select: 'name logoUrl' } });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    stats: {
      totalApplied: applications.length,
      ...statusCounts,
    },
    recentActivity: applications.slice(0, 5),
  });
});

// @desc    Import profile fields from a LinkedIn data-export file
//          (LinkedIn Settings -> Data privacy -> Get a copy of your data).
//          We never talk to LinkedIn's API directly — the user exports their
//          own data and uploads the JSON/CSV here, which keeps this legal
//          and requires no API credentials.
// @route   POST /api/users/import-linkedin
// @access  Private
const importLinkedInProfile = asyncHandler(async (req, res) => {
  const { profile, profileUrl, sourceFile } = req.body;

  if (!profile || typeof profile !== 'object') {
    res.status(400);
    throw new Error('No parsed LinkedIn profile data was provided');
  }

  const updates = {};

  if (profile.headline) updates.headline = String(profile.headline).slice(0, 150);
  if (profile.summary) updates.bio = String(profile.summary).slice(0, 2000);
  if (profile.location) updates.location = String(profile.location);

  if (Array.isArray(profile.skills)) {
    updates.skills = profile.skills.map((s) => String(s).trim()).filter(Boolean).slice(0, 50);
  }

  if (Array.isArray(profile.positions)) {
    updates.experience = profile.positions.slice(0, 30).map((p) => ({
      title: p.title || '',
      company: p.companyName || p.company || '',
      startDate: p.startDate ? new Date(p.startDate) : undefined,
      endDate: p.endDate ? new Date(p.endDate) : undefined,
      current: !p.endDate,
      description: p.description || '',
    }));
  }

  if (Array.isArray(profile.education)) {
    updates.education = profile.education.slice(0, 20).map((e) => ({
      institution: e.schoolName || e.institution || '',
      degree: e.degreeName || e.degree || '',
      fieldOfStudy: e.fieldOfStudy || '',
      startYear: e.startYear ? Number(e.startYear) : undefined,
      endYear: e.endYear ? Number(e.endYear) : undefined,
    }));
  }

  updates.linkedinImport = {
    importedAt: new Date(),
    sourceFile: sourceFile ? String(sourceFile).slice(0, 200) : undefined,
    profileUrl: profileUrl ? String(profileUrl).slice(0, 300) : undefined,
  };

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user: user.toPublicJSON() });
});

// @desc    Get another user's public profile
// @route   GET /api/users/:id
// @access  Private (logged-in users only, to keep profile browsing behind auth)
const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -email -phone');
  if (!user || !user.isActive) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ success: true, user });
});

module.exports = {
  updateProfile,
  uploadResume,
  getDashboard,
  getPublicProfile,
  importLinkedInProfile,
};
