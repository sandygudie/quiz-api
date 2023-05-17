// const { info } = require('../config/logger')

// handling non existing routes
const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'Route not found' })
  return next()
}
const errorHandler = (error, response, next) => {
  console.log('check error', error)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'Invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'Token expired'
    })
  } else if (error.name === 'TypeError') {
    return response.status(400).json({
      error: 'Invalid Request'
    })
  }
  // info(error.message)
  return next()
}

// This overrides the default error handler to return a json response
const defaultErrorHandler = (error, req, res) => {
  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message
  })
  return
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  defaultErrorHandler
}
