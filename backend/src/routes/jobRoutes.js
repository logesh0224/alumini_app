// backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/jobApplication'); // Make sure to import Application model
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Alumni only)
router.post('/', protect, authorize('alumni'), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      salary,
      jobType,
      deadline
    } = req.body;

    // Create job with the alumni's ID as the poster
    const job = new Job({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      jobType,
      postedBy: req.user.id,
      deadline: new Date(deadline)
    });

    await job.save();

    res.status(201).json({
      success: true,
      data: job
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
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Fetch all jobs from the Job model
    const jobs = await Job.find().sort({ createdAt: -1 }); // Sort jobs by createdAt (most recent first)
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/jobs/my-jobs
// @desc    Get all jobs posted by the logged-in alumni
// @access  Private (Alumni only)
router.get('/my-jobs', protect, authorize('alumni'), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Private (Alumni only for their own jobs)
router.get('/:id', protect, authorize('alumni'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if the job belongs to the logged-in alumni
    // if (job.postedBy.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to access this job'
    //   });
    // }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private (Alumni only for their own jobs)
router.put('/:id', protect, authorize('alumni'), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if the job belongs to the logged-in alumni
    // if (job.postedBy.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to update this job'
    //   });
    // }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
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

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private (Alumni only for their own jobs)
router.delete('/:id', protect, authorize('alumni'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if the job belongs to the logged-in alumni
    // if (job.postedBy.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to delete this job'
    //   });
    // }

    // Using findByIdAndDelete instead of remove()
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/jobs/applications/:jobId
// @desc    Get all applications for a specific job
// @access  Private (Alumni only for their own jobs)
router.get('/applications/:jobId', protect, authorize('alumni'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if the job belongs to the logged-in alumni
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    // Get applications for this job
    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: 'student',
        select: 'name email department graduationYear resume'
      });

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

module.exports = router;