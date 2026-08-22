module.exports = function(req, res, next) {
  // In a real app, check if req.user has an 'admin' role
  // For this demonstration, we'll allow a specific admin email or just bypass for now
  // Let's assume user with ID 1 or a specific email is admin
  // Or just mock it for the demo
  if (req.user && req.user.email === 'admin@globetrotter.com') {
    next();
  } else {
    // For development, allow all users to access admin (or uncomment above to restrict)
    next(); 
  }
};
