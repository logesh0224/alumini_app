// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const { protect, authorize } = require('../middleware/auth');
const Application = require('../models/jobApplication');
const Job = require('../models/Job');

// @route   POST /api/students/register
// @desc    Register student
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, graduationYear } = req.body;

    // Check if student already exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create new student
    student = new Student({
      name,
      email,
      password,
      department,
      graduationYear,
      role: 'student'
    });

    await student.save();

    // Create token
    const token = student.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        department: student.department,
        graduationYear: student.graduationYear
      }
    });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/students/login
// @desc    Login student
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = student.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        department: student.department,
        graduationYear: student.graduationYear
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students/me
// @desc    Get current logged in student
// @access  Private
router.get('/me', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/students/me
// @desc    Update student profile
// @access  Private
router.put('/me', protect, authorize('student'), async (req, res) => {
  try {
    const { name, department, graduationYear } = req.body;
    
    // Don't allow updates to email or role for security
    const updatedData = { name, department, graduationYear };
    
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      updatedData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students/applications
// @desc    Get all applications for the logged-in student
// @access  Private (Students only)
router.get('/applications', protect, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location jobType salary deadline postedBy',
        populate: {
          path: 'postedBy',
          select: 'name email batch'
        }
      })
    
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/students/applications/:jobId
// @desc    Apply for a job
// @access  Private (Students only)
router.post('/applications/:jobId', protect, authorize('student'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resume, coverLetter } = req.body;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check if application deadline has passed
    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      student: req.user.id
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }
    
    // Create new application
    const application = new Application({
      job: jobId,
      student: req.user.id,
      resume,
      coverLetter,
      status: 'pending'
    });
    
    await application.save();
    
    res.status(201).json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students/applications/check/:jobId
// @desc    Check if student has already applied for a job
// @access  Private (Students only)
router.get('/applications/check/:jobId', protect, authorize('student'), async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const application = await Application.findOne({
      job: jobId,
      student: req.user.id
    });
    
    res.status(200).json({
      success: true,
      applied: application ? true : false
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students/applications/:id
// @desc    Get single application details
// @access  Private (Students only)
router.get('/applications/:id', protect, authorize('student'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        select: 'title company location jobType salary deadline description requirements postedBy',
        populate: {
          path: 'postedBy',
          select: 'name email batch'
        }
      });
    
    // Check if application exists
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }
    
    // Make sure student is viewing their own application
    if (application.student.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this application' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students/jobs/:id
// @desc    Get job details for students
// @access  Private (Students only)
router.get('/jobs/:id', protect, authorize('student'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'postedBy',
        select: 'name email batch'
      });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;