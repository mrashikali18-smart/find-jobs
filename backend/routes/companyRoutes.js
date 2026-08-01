const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createCompany,
  getMyCompany,
  updateCompany,
  getCompanyBySlug,
} = require('../controllers/companyController');

const router = express.Router();

router.get('/mine', protect, authorize('recruiter'), getMyCompany);
router.post('/', protect, authorize('recruiter'), createCompany);
router.put('/:id', protect, authorize('recruiter'), updateCompany);
router.get('/:slug', getCompanyBySlug);

module.exports = router;
