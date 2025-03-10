// backend/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  requirements: {
    type: String,
    required: [true, 'Please add requirements'],
  },
  salary: {
    type: String,
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: [true, 'Please add job type'],
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Alumni',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: [true, 'Please add application deadline'],
  },
});

module.exports = mongoose.model('Job', JobSchema);