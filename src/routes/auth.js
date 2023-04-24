const Router = require('express')
const { register, verifyUser, login,refreshToken } = require('../controllers/auth')

const authRouter = Router()
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/verifyemail/:confirmationCode', verifyUser)
authRouter.post('/refresh', refreshToken)

module.exports = { authRouter }
