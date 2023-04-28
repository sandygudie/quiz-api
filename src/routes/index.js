const express = require('express')
const apiRouter = express.Router()
const { verifyToken } = require('../middlewares/token')
const { quizRouter } = require('./quiz')
const { contributorRouter } = require('./contributor')
const { authRouter } = require('./auth')


apiRouter.use('/quiz',  quizRouter)
apiRouter.use('/contributor', verifyToken, contributorRouter)
apiRouter.use('/auth', authRouter)

module.exports = apiRouter
