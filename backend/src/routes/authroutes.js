// backend/routes/authRoutes.js
const express = require('express');
const { login, registerAlumni, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register/alumni', registerAlumni);
router.get('/me', protect, getMe);

module.exports = router;