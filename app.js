const express = require("express");
const cors = require("cors");
const middleware = require("./middlewares/error-handler");

const app = express();

app.use(cors());
app.use(express.json());

// Route handler
require("./routes/routes_handler")(app);

// middleware
// app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
