const express = require('express');
const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
  getCategories,
} = require('../controllers/jobController');

const router = express.Router();

// SECURITY: ObjectId validation middleware
const validateJobId = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid job ID format');
    }
    return true;
  }),
  validate,
];

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

// Public
router.get('/', getJobs);
router.get('/meta/categories', getCategories);

// Recruiter-only (must be before /:id to avoid route collision)
router.get('/recruiter/mine', protect, authorize('recruiter'), getMyPostedJobs);

router.get('/:id', validateJobId, getJobById);

router.post('/', protect, authorize('recruiter'), jobValidation, validate, createJob);
router.put('/:id', protect, authorize('recruiter'), validateJobId, updateJob);
router.delete('/:id', protect, authorize('recruiter'), validateJobId, deleteJob);

module.exports = router;
