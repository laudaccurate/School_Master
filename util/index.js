module.exports.error = (message, next, status) => {
  const error = new Error(message);
  error.status = status || 401;
  return next(error);
};
