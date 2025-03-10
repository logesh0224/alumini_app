// backend/routes/alumniRoutes.js
const express = require('express');
// In alumniRoutes.js, change this line:
const {
    createJob,
    getAlumniJobs,
    updateJob,
    deleteJob,
    getJobApplications,
    updateApplicationStatus
  } = require('../controllers/aluminiController'); // Changed from adminController to alumniController

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rolecheck');

const router = express.Router();

// All routes are protected and require alumni role
router.use(protect);
router.use(authorize('alumni'));

router.route('/jobs')
  .get(getAlumniJobs)
  .post(createJob);

router.route('/jobs/:id')
  .put(updateJob)
  .delete(deleteJob);

router.get('/jobs/:id/applications', getJobApplications);
router.put('/applications/:id', updateApplicationStatus);

module.exports = router;