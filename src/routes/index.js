const express = require('express')
const apiRouter = express.Router()
const { verifyToken } = require('../middlewares/token')
const { quizRouter } = require('./quiz')
const { contributorRouter } = require('./contributor')
const { authRouter } = require('./auth')
const { isUserVerified } = require('../middlewares/userCheck')

apiRouter.use('/quiz', quizRouter)
apiRouter.use('/contributor', verifyToken, isUserVerified, contributorRouter)
apiRouter.use('/auth', authRouter)

module.exports = apiRouter
