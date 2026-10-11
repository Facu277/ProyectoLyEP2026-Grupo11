function errorHandler(
  error,
  req,
  res,
  next
) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error:
      "Error interno del servidor."
  });
}

module.exports = {
  errorHandler
};