const Router = require('express')
const { register, verifyUser, login } = require('../controllers/auth')

const authRouter = Router()
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/verifyemail/:confirmationCode', verifyUser)

module.exports = { authRouter }
