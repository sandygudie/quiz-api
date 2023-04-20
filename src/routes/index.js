const express = require('express')
const apiRouter = express.Router()
const { verifyToken } = require('../utils/token')
const { quizRouter } = require('./quiz')
const { userRouter } = require('./user')
const { authRouter } = require('./auth')

apiRouter.use('/quiz', quizRouter)
apiRouter.use('/user', verifyToken, userRouter)
apiRouter.use('/auth', authRouter)

module.exports = apiRouter
