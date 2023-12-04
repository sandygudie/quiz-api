const Router = require('express')
const {
  register,
  verifyUser,
  login,
  refreshToken,
  verifyResetLink,
  forgotPassword,
  resetPassword
} = require('../controllers/auth')

const authRouter = Router()
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/verifyemail/:confirmationCode', verifyUser)
authRouter.post('/refreshtoken', refreshToken)
authRouter.post('/forgot-password', forgotPassword)
authRouter.get('/verify-reset-link/:resetCode', verifyResetLink)
authRouter.patch('/reset-password/:resetCode', resetPassword)

module.exports = { authRouter }
