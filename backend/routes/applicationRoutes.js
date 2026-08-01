const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicantsForJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');

const router = express.Router();

router.use(protect);

router.get('/mine', authorize('jobseeker'), getMyApplications);
router.post('/:jobId', authorize('jobseeker'), applyToJob);
router.delete('/:id', authorize('jobseeker'), withdrawApplication);

router.get('/job/:jobId', authorize('recruiter'), getApplicantsForJob);
router.put('/:id/status', authorize('recruiter'), updateApplicationStatus);

module.exports = router;
