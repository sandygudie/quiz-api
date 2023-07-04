const Contributor = require('../models/contributor')
const bcrypt = require('bcrypt')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { generateToken } = require('../middlewares/token')
const { emailVerification, passwordResetLink } = require('../utils/sendEmail/emailhandler')
const {
  loginValidation,
  userValidation,
  resetpasswordValidation,
  forgotpasswordValidation,
  refreshTokenValidation
} = require('../utils/validator')
const jwt = require('jsonwebtoken')

const emailVerificationToken = async (contributor) => {
  const { accessToken } = await generateToken(contributor)
  contributor.confirmationCode = accessToken
  const newContributor = await contributor.save()
  return newContributor
}

const register = async (req, res) => {
  const { username, email, password } = req.body
  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }
  const { error } = userValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)

  if (password.length < 5) {
    return errorResponse(res, 400, 'Password must be at least 8 characters long')
  }

  const existingContributor = await Contributor.findOne({ email })
  if (existingContributor) {
    return errorResponse(res, 400, 'Account already exist')
  }
  // Encrypt password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Create a new user
  const contributor = new Contributor({
    username: username,
    email: email,
    password: passwordHash,
    role: req.body.role || 'contributor'
  })
  // Generate token for confirmation code
  const newContributor = await emailVerificationToken(contributor)
  console.log(newContributor)
  // Send verification link
  let response = await emailVerification(newContributor)
  if (response) {
    return successResponse(res, 201, 'User registered successfully! Please check your email')
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }
  const { error } = loginValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)

  const contributor = await Contributor.findOne({ email })
  if (contributor && (await bcrypt.compare(password, contributor.password))) {
    if (contributor.isVerified === 'pending') {
      // Generate token for confirmation code
      const newContributor = await emailVerificationToken(contributor)
      await emailVerification(newContributor)
      return errorResponse(res, 400, 'Verify Your Email to access your account')
    }

    const { accessToken, refreshToken } = await generateToken(contributor)

    // Assigning refresh token in http-only cookie
    // res.cookie('refresh_token', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'Lax', // or 'Strict', it depends
    //   maxAge: process.env.ACCESS_TOKEN_JWT_REFRESH_EXPIRATION
    // })

    return res
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax', // or 'Strict', it depends
        maxAge: 840000
      })
      .status(200)
      .json({ message: 'Logged in successfully', user: contributor, accessToken })
    // return successResponse(res, 200, 'login successfully! ', newContributor)
  }
  return errorResponse(res, 400, 'Invalid Credentials')
}

const verifyUser = async (req, res) => {
  const contributor = await Contributor.findOne({
    confirmationCode: req.params.confirmationCode
  })
  if (contributor) {
    contributor.isVerified = 'verified'
    contributor.confirmationCode = null
    await contributor.save()
    return successResponse(res, 200, 'Email Verification Sucessfully!')
  }
  return errorResponse(res, 404, 'Invalid link')
}

// pending review
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token

  const { error } = refreshTokenValidation(refreshToken)
  if (error) return errorResponse(res, 400, error.details[0].message)

  // Verifying refresh token (if refresh token is expired or invalid)
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT_SECRET)
  if (!decoded) return errorResponse(res, 401, 'Invalid refresh token')

  const payload = { id: decoded.id, roles: decoded.role }
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_JWT_EXPIRATION
  })
  return successResponse(res, 200, 'Updated Access token', accessToken)
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  const { error } = forgotpasswordValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  const contributor = await Contributor.findOne({ email })
  if (!contributor) {
    return errorResponse(res, 400, 'Email not found')
  }

  const resetPasswordToken = await generateToken(contributor)
  contributor.confirmationCode = resetPasswordToken.accessToken
  await contributor.save()
  // Send reset link
  let response = await passwordResetLink(contributor)
  if (response) {
    return successResponse(res, 200, 'Reset link sent to your email', email)
  }
}

const verifyResetLink = async (req, res) => {
  const contributor = await Contributor.findOne({
    confirmationCode: req.params.resetCode
  })
  if (contributor) {
    return successResponse(res, 200, 'valid link!')
  }
  return errorResponse(res, 404, 'Invalid link or expired')
}

const resetPassword = async (req, res) => {
  const { error } = resetpasswordValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  const contributor = await Contributor.findOne({
    confirmationCode: req.params.resetCode
  })
  if (contributor) {
    // Encrypt password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    contributor.password = passwordHash
    contributor.confirmationCode = null
    await contributor.save()
    return successResponse(res, 200, 'Password reset sucessfully!', {
      password: req.body.password
    })
  }
  return errorResponse(res, 404, 'Invalid link or expired')
}
module.exports = {
  register,
  verifyUser,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyResetLink
}
// Todo
// review refresh token
