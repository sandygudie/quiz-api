// handling non existing routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Route not found' })
}

// This overrides the default error handler to return a json response
const defaultErrorHandler = (err, req, res) => {
  console.log(err)
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message
  })
}

module.exports = {
  unknownEndpoint,
  defaultErrorHandler
}
