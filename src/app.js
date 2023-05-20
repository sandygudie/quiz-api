const express = require('express')
require('express-async-errors')
var cookieParser = require('cookie-parser')

const cors = require('cors')
const middleware = require('./middlewares/error-handler')
const { connectToDB } = require('./db/db')
const apiRouter = require('./routes')

const app = express()
app.use(cookieParser())

const message = 'Welcome to QuizBase'

connectToDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.status(200).send({ message }))
app.use('/api/v1', apiRouter)

// middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(middleware.defaultErrorHandler)

module.exports = app
