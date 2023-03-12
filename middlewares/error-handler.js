const logger = require("./logger");


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.message === "invalid request") {
    return response.status(400).send({ error: error.message });
  } else if (error.message === "ValidationError") {
    return response.status(400).json({ error: "Validation Error" });
  } else if (error.message === "no request body") {
    return response.status(400).json({ error: error.message });
  } else if (error.message === "request failed") {
    return response.status(400).json({ error: error.message });
  } else if (error.message === "quiz not found") {
    return response.status(400).json({ error: error.message });
  } else if (error.message === "TypeError") {
    return response.status(400).json({ error: "Invalid Request" });
  }
  logger.error(error.message);
  next(error);
};
module.exports = {
  unknownEndpoint,
  errorHandler,
};
