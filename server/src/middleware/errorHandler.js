function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: 'Please check the lead details.', errors: Object.values(error.errors).map((item) => ({ field: item.path, message: item.message })) })
  }
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid lead identifier.' })
  console.error(error)
  res.status(500).json({ message: 'Something went wrong. Please try again.' })
}

module.exports = errorHandler
