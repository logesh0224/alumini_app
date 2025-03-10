// backend/routes/adminRoutes.js
const express = require('express');
const {
  getPendingAlumni,
  approveAlumni,
  getApprovedAlumni
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rolecheck');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/alumni/pending', getPendingAlumni);
router.get('/alumni/approved', getApprovedAlumni);
router.put('/alumni/:id/approve', approveAlumni);

module.exports = router;