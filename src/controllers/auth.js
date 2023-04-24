const User = require('../models/users')
const bcrypt = require('bcrypt')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { generateToken } = require('../utils/token')
const { sendEmail } = require('../utils/sendEmail/emailhandler')

const emailVerification = async ( user) => {
  const verification_url = `https://quizbase.netlify.app/email-verify/${user.token}`
  await sendEmail({
    email: user.email,
    subject: 'Verify your email address',
    verification_url: verification_url
  })
}

/**
 * To create a new User
 * @return {object} User created
 */
const register = async (req, res) => {
  const { username, email, password } = req.body
  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }
  if (password.length < 5) {
    return errorResponse(res, 400, 'Password must be at least 8 characters long')
  }
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return errorResponse(res, 400, 'Account already exist')
  }
  // Encrypt password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Create a new user
  const user = new User({
    username: username,
    email: email,
    password: passwordHash
  })
  // Generate token
  const { access_token } = await generateToken(user)
  user.token = access_token

  const newUser = await user.save()

  // Send verification link
  await emailVerification(newUser)

  return successResponse(
    res,
    201,
    'User was registered successfully! Please check your email',
    newUser
  )
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    const { access_token } = await generateToken(user)
    user.token = access_token

    const newUser = await user.save()

    return successResponse(res, 200, 'login successfully! ', newUser)
  }
  return errorResponse(res, 400, 'Invalid Credentials')
}

const verifyUser = async (req, res) => {
  const user = await User.findOne({
    token: req.params.confirmationCode
  })
  if (user) {
    user.isVerified = 'Verified'
    await user.save()
    return successResponse(res, 200, 'email verified sucessfully')
  }
  return errorResponse(res, 404, 'Invalid link')
}

module.exports = {
  register,
  verifyUser,
  login
}
// Todo
// refresh token
// reset password
// forgot password
