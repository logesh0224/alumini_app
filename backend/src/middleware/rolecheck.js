// backend/middleware/rolecheck.js
// Middleware to check user roles for authorization

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: `User role ${req.user.role} is not authorized to access this route`,
        });
      }
      next();
    };
  };