// backend/routes/studentRoutes.js
const express = require('express');
const {
  applyForJob,
  getStudentApplications,
  getAvailableJobs,
  getApplicationDetails,
  updateProfile,
  withdrawApplication
} = require('../controllers/studentController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rolecheck');

const router = express.Router();

// All routes are protected and require student role
router.use(protect);
router.use(authorize('student'));

router.get('/jobs', getAvailableJobs);
router.post('/jobs/:id/apply', applyForJob);

router.route('/applications')
  .get(getStudentApplications);

router.route('/applications/:id')
  .get(getApplicationDetails)
  .delete(withdrawApplication);

router.put('/profile', updateProfile);

module.exports = router;