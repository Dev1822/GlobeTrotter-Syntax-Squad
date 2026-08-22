module.exports = function requireDb(req, res, next) {
  // Database connection is managed by Sequelize at startup
  return next();
};
