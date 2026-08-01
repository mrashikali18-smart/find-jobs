const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }
  next();
};

// ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ${paramName} format`);
    }
    return true;
  }),
  handleValidationErrors,
];

// Job validation
const validateJobCreation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description').trim().isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters'),
  body('salaryMin').optional().isInt({ min: 0 }).withMessage('Salary must be positive'),
  body('salaryMax').optional().isInt({ min: 0 }).withMessage('Salary must be positive'),
  body('jobType').isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Invalid job type'),
  body('experienceLevel').isIn(['entry', 'mid', 'senior']).withMessage('Invalid experience level'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('skills.*').trim().isLength({ min: 1, max: 50 }).withMessage('Each skill must be 1-50 characters'),
  body().custom((value) => {
    if (value.salaryMin && value.salaryMax && Number(value.salaryMin) > Number(value.salaryMax)) {
      throw new Error('Salary min must be less than salary max');
    }
    return true;
  }),
  handleValidationErrors,
];

// User profile validation
const validateProfileUpdate = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('phone').optional().matches(/^[\d\s\-\+\(\)]{0,20}$/).withMessage('Invalid phone format'),
  body('location').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Location must be 1-100 characters'),
  body('headline').optional().trim().isLength({ min: 0, max: 200 }).withMessage('Headline must be max 200 characters'),
  body('bio').optional().trim().isLength({ min: 0, max: 2000 }).withMessage('Bio must be max 2000 characters'),
  body('skills').optional().isArray().custom((arr) => {
    if (arr.length > 50) throw new Error('Maximum 50 skills allowed');
    arr.forEach((skill) => {
      if (typeof skill !== 'string' || skill.length > 50) {
        throw new Error('Each skill must be a string of max 50 characters');
      }
    });
    return true;
  }),
  handleValidationErrors,
];

// Search validation
const validateSearch = [
  body('q').trim().isLength({ min: 1, max: 256 }).withMessage('Search query must be 1-256 characters'),
  body('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  body('page').optional().isInt({ min: 1, max: 10000 }).withMessage('Page must be 1-10000'),
  handleValidationErrors,
];

// Post validation
const validatePostCreation = [
  body('content').trim().isLength({ min: 1, max: 3000 }).withMessage('Post must be 1-3000 characters'),
  handleValidationErrors,
];

// Connection validation
const validateConnectionRequest = [
  body('senderId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) throw new Error('Invalid sender ID');
    return true;
  }),
  body('recipientId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) throw new Error('Invalid recipient ID');
    return true;
  }),
  handleValidationErrors,
];

// Application validation
const validateApplicationCreation = [
  body('jobId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) throw new Error('Invalid job ID');
    return true;
  }),
  body('coverLetter').optional().trim().isLength({ max: 2000 }).withMessage('Cover letter must be max 2000 characters'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateObjectId,
  validateJobCreation,
  validateProfileUpdate,
  validateSearch,
  validatePostCreation,
  validateConnectionRequest,
  validateApplicationCreation,
};
