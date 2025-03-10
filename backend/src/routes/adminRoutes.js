// backend/routes/adminRoutes.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rolecheck');
const Admin = require('../models/admin');
const Alumni = require('../models/alumini');
const Job = require('../models/Job');
 // Assuming you have a company model

const router = express.Router();

// Admin registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create new admin
    admin = new Admin({
      name,
      email,
      password
    });

    await admin.save();

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully!'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = admin.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current logged in admin
router.get('/me', protect, authorize('admin'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get pending alumni
router.get('/pending-alumni', protect, authorize('admin'), async (req, res) => {
  try {
    // Fetch alumni where isApproved is false
    const pendingAlumni = await Alumni.find({ isApproved: false });
    
    res.status(200).json({
      success: true,
      count: pendingAlumni.length,
      data: pendingAlumni
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Approve an alumni account
router.put('/approve-alumni/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    res.status(200).json({
      success: true,
      data: alumni
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reject an alumni account
router.delete('/reject-alumni/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);

    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all approved alumni
router.get('/alumni', protect, authorize('admin'), async (req, res) => {
  try {
    const alumni = await Alumni.find({ isApproved: true });
    
    res.status(200).json({
      success: true,
      count: alumni.length,
      data: alumni
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get recent alumni
router.get('/recent-alumni', protect, authorize('admin'), async (req, res) => {
  try {
    // Get 5 most recent approved alumni
    const recentAlumni = await Alumni.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Prepare alumni data with status field
    const alumni = recentAlumni.map(alumnus => ({
      _id: alumnus._id,
      name: alumnus.name,
      email: alumnus.email,
      department: alumnus.department || 'Not Specified',
      graduationYear: alumnus.graduationYear || 'Not Specified',
      status: 'approved'
    }));
    
    res.status(200).json({
      success: true,
      count: alumni.length,
      alumni
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Suspend an alumni
router.delete('/suspend-alumni/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);

    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Alumni suspended successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    // Count total approved alumni
    const alumniQuery = await Alumni.find({ isApproved: true });
    const totalAlumni = alumniQuery.length;
    
    // Count pending alumni
    const pendingQuery = await Alumni.find({ isApproved: false });
    const pendingAlumni = pendingQuery.length;
    
    // Count total jobs
    const jobsQuery = await Job.find();
    const totalJobs = jobsQuery.length;
    
    // Count total companies
    // const companiesQuery = await Company.find();
    // const totalCompanies = companiesQuery.length;
    
    res.status(200).json({
      success: true,
      totalAlumni,
      totalJobs,
      pendingAlumni
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;