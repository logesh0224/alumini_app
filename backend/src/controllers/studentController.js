// backend/controllers/studentController.js
const JobApplication = require('../models/jobApplication');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/student/jobs/:id/apply
// @access  Private/Student
exports.applyForJob = async (req, res, next) => {
  try {
    const { coverLetter, resume } = req.body;

    // Check if job exists
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({
      job: req.params.id,
      student: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this job',
      });
    }

    // Create application
    const application = await JobApplication.create({
      job: req.params.id,
      student: req.user.id,
      coverLetter,
      resume: resume || req.user.resume,
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications by student
// @route   GET /api/student/applications
// @access  Private/Student
exports.getStudentApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({
      student: req.user.id,
    }).populate({
      path: 'job',
      select: 'title company location jobType deadline',
      populate: {
        path: 'postedBy',
        select: 'name company position'
      }
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available jobs for students
// @route   GET /api/student/jobs
// @access  Private/Student
exports.getAvailableJobs = async (req, res, next) => {
  try {
    // Get current date
    const now = new Date();
    
    // Find jobs where deadline is in the future
    const jobs = await Job.find({
      deadline: { $gt: now }
    }).populate({
      path: 'postedBy',
      select: 'name company position'
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application details
// @route   GET /api/student/applications/:id
// @access  Private/Student
exports.getApplicationDetails = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id).populate({
      path: 'job',
      select: 'title company location description requirements jobType deadline',
      populate: {
        path: 'postedBy',
        select: 'name company position'
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check if this application belongs to the student
    if (application.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private/Student
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, department, graduationYear, resume } = req.body;
    const fieldsToUpdate = {};
    
    if (name) fieldsToUpdate.name = name;
    if (department) fieldsToUpdate.department = department;
    if (graduationYear) fieldsToUpdate.graduationYear = graduationYear;
    if (resume) fieldsToUpdate.resume = resume;
    
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw job application
// @route   DELETE /api/student/applications/:id
// @access  Private/Student
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check if this application belongs to the student
    if (application.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to withdraw this application'
      });
    }

    // Only allow withdrawal if status is pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot withdraw application that has been reviewed'
      });
    }

    await application.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};