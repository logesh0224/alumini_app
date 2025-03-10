const Admin = require('../models/admin');
const Student = require('../models/student');
const Alumni = require('../models/alumini');
const bcrypt = require('bcryptjs');

// @desc    Login user (alumni, student, admin)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validate email & password
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email, password, and role',
      });
    }

    // Check for user based on role
    let user;
    if (role === 'admin') {
      user = await Admin.findOne({ email }).select('+password');
      // If no admin exists, create a dummy admin
      if (!user) {
        // const hashedPassword = await bcrypt.hash('admin123', 10); // Hash the default password
        // user = await Admin.create({
        //   name: 'Admin User',
        //   email: 'admin@example.com',
        //   password: hashedPassword,
        // });
        console.log('no user found')
      }
    } else if (role === 'student') {
      user = await Student.findOne({ email }).select('+password');
      // If no student exists, create a dummy student
      if (!user) {
        const hashedPassword = await bcrypt.hash('student123', 10); // Hash the default password
        // user = await Student.create({
        //   name: 'Student User',
        //   email: 'student@example.com',
        //   password: hashedPassword,
        // // });
        console.log('no student here000')
      }
    } else if (role === 'alumni') {
      user = await Alumni.findOne({ email }).select('+password');
      // If no alumni exists, create a dummy alumni (but mark as unapproved)
      if (!user) {
        const hashedPassword = await bcrypt.hash('alumni123', 10); // Hash the default password
        user = await Alumni.create({
          name: 'Alumni User',
          email: 'alumni@example.com',
          password: hashedPassword,
          graduationYear: 2020,
          company: 'Example Company',
          position: 'Software Engineer',
          isApproved: false, // Default alumni is unapproved
        });
      }

      // Check if alumni is approved
      if (user && !user.isApproved) {
        return res.status(401).json({
          success: false,
          error: 'Your account is pending approval from admin',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid role',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register alumni
// @route   POST /api/auth/register/alumni
// @access  Public
exports.registerAlumni = async (req, res, next) => {
  try {
    const { name, email, password, graduationYear, company, position } = req.body;

    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        error: 'Alumni with this email already exists',
      });
    }

    // Create alumni
    const alumni = await Alumni.create({
      name,
      email,
      password,
      graduationYear,
      company,
      position,
    });

    // Create token
    const token = alumni.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin approval to log in.',
      token,
      user: {
        id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        role: 'alumni',
        isApproved: alumni.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};