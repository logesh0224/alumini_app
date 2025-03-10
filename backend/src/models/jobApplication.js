// backend/models/JobApplication.js
const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: true,
  },
  resume: {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent student from applying to the same job more than once
JobApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', JobApplicationSchema);