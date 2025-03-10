// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Student = require('../models/student');
const Alumni = require('../models/alumini');

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
      error: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    let user = await Admin.findById(decoded.id);
    
    if (!user) {
      user = await Student.findById(decoded.id);
    }
    
    if (!user) {
      user = await Alumni.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    // Alumni must be approved to access protected routes
    if (user.role === 'alumni' && !user.isApproved) {
      return res.status(401).json({
        success: false,
        error: 'Your account is pending approval',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }
};