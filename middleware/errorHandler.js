const errorHandler = function(err, req, res, next) {
  var statusCode = err.statusCode || 500;
  var message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    statusCode = 409;
    var field = Object.keys(err.keyValue)[0];
    message = field.charAt(0).toUpperCase() + field.slice(1) + " already exists";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(function(val) {
      return val.message;
    }).join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Error: " + message);
  }

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
};

const notFound = function(req, res, next) {
  var error = new Error("Route not found: " + req.originalUrl);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };