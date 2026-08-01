const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');

// @desc    Create a company profile (recruiter only, one per recruiter)
// @route   POST /api/companies
// @access  Private (recruiter)
const createCompany = asyncHandler(async (req, res) => {
  const existing = await Company.findOne({ owner: req.user._id });
  if (existing) {
    res.status(409);
    throw new Error('You already have a company profile. Update it instead.');
  }

  const company = await Company.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, company });
});

// @desc    Get the logged-in recruiter's company
// @route   GET /api/companies/mine
// @access  Private (recruiter)
const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  res.status(200).json({ success: true, company });
});

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private (recruiter, owner only)
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  if (company.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this company');
  }

  // SECURITY: Whitelist allowed fields to prevent mass assignment
  const allowedFields = ['name', 'logoUrl', 'website', 'industry', 'location', 'description'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  Object.assign(company, updates);
  await company.save();

  res.status(200).json({ success: true, company });
});

// @desc    Get a single company by slug (public)
// @route   GET /api/companies/:slug
// @access  Public
const getCompanyBySlug = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ slug: req.params.slug });
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  res.status(200).json({ success: true, company });
});

module.exports = { createCompany, getMyCompany, updateCompany, getCompanyBySlug };
