const errorHandler = (error) => {
  console.error(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
