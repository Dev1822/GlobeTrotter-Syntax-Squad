// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  void next; // keep `next` parameter for Express but mark as used for linters

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ msg: messages.join(", ") });
  }

  // Sequelize duplicate key
  if (err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ msg: messages.join(", ") });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token has expired" });
  }

  res.status(err.statusCode || 500).json({
    msg: err.message || "Server Error",
  });
};

module.exports = errorHandler;
