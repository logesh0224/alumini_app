// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Alumni = require('../models/alumini');
const Student = require('../models/student');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by token id and determine role
    let user;

    // Try to find user in different collections based on the id
    user = await Admin.findById(decoded.id);
    if (user) {
      req.user = {
        id: user._id,
        role: 'admin'
      };
      return next();
    }

    user = await Alumni.findById(decoded.id);
    if (user) {
      req.user = {
        id: user._id,
        role: 'alumni'
      };
      return next();
    }

    user = await Student.findById(decoded.id);
    if (user) {
      req.user = {
        id: user._id,
        role: 'student'
      };
      return next();
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};