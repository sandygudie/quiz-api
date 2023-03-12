const express = require('express')
require('express-async-errors')
const cors = require('cors')
const middleware = require('./middlewares/error-handler')

const app = express()

app.use(cors())
app.use(express.json())

// Route handler
require('./routes/routes_handler')(app)

// middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

// review eslint rules
// install prettier
// install husky
// set up api documentation
// set up postman documentataion
