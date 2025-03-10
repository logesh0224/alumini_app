// backend/routes/jobRoutes.js
const express = require('express');
const { getJobs, getJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getJobs);
router.get('/:id', getJob);

module.exports = router;