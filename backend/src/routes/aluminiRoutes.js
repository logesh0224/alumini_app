const express = require('express');
const router = express.Router();
const Alumni = require('../models/alumini');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/alumni/register
// @desc    Register alumni account
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, graduationYear, company, position } = req.body;

    // Check if alumni already exists
    let alumni = await Alumni.findOne({ email });
    if (alumni) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create new alumni
    alumni = new Alumni({
      name,
      email,
      password,
      graduationYear,
      company,
      position,
      isApproved: false // Default to false - requires admin approval
    });

    await alumni.save();

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending approval by an administrator.'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/alumni/login
// @desc    Login alumni
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if alumni exists
    const alumni = await Alumni.findOne({ email }).select('+password');
    if (!alumni) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if account is approved
    if (!alumni.isApproved) {
      return res.status(401).json({ 
        success: false, 
        message: 'Your account is pending approval by an administrator'
      });
    }

    // Check if password matches
    const isMatch = await alumni.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = alumni.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        role: alumni.role,
        graduationYear: alumni.graduationYear,
        company: alumni.company,
        position: alumni.position
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/alumni/me
// @desc    Get current logged in alumni
// @access  Private
router.get('/me', protect, authorize('alumni'), async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: alumni
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/alumni
// @desc    Get available alumni
// @access  Private/Admin


module.exports = router;