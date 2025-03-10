// backend/controllers/alumniController.js
const Job = require('../models/Job');
const JobApplication = require('../models/jobApplication');

// @desc    Create a job
// @route   POST /api/alumni/jobs
// @access  Private/Alumni
exports.createJob = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.postedBy = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs posted by alumni
// @route   GET /api/alumni/jobs
// @access  Private/Alumni
exports.getAlumniJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/alumni/jobs/:id
// @access  Private/Alumni
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    // Make sure user is job owner
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this job',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/alumni/jobs/:id
// @access  Private/Alumni
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    // Make sure user is job owner
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this job',
      });
    }

    await job.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/alumni/jobs/:id/applications
// @access  Private/Alumni
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    // Make sure user is job owner
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view applications for this job',
      });
    }

    const applications = await JobApplication.find({ job: req.params.id }).populate({
      path: 'student',
      select: 'name email department graduationYear',
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

// @desc    Update application status
// @route   PUT /api/alumni/applications/:id
// @access  Private/Alumni
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid status',
      });
    }

    const application = await JobApplication.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found',
      });
    }

    // Make sure user is job owner
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this application',
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};