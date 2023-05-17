const Contributor = require('../models/contributor')
const bcrypt = require('bcrypt')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { generateToken } = require('../middlewares/token')
const { emailVerification, passwordResetLink } = require('../utils/sendEmail/emailhandler')
const {
  loginValidation,
  userValidation,
  resetpasswordValidation,
  forgotpasswordValidation
} = require('../utils/validator')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
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
    const { access_token } = await generateToken(contributor)
    contributor.confirmationCode = access_token

    const newContributor = await contributor.save()

    // Send verification link
    let response = await emailVerification(newContributor)
    if (response) {
      return successResponse(res, 201, 'User registered successfully! Please check your email')
    }
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!req.body) {
      return errorResponse(res, 400, 'no request body')
    }
    const { error } = loginValidation(req.body)
    if (error) return errorResponse(res, 400, error.details[0].message)

    const contributor = await Contributor.findOne({ email })
    if (contributor && (await bcrypt.compare(password, contributor.password))) {
      if (contributor.isVerified === 'pending') {
        await emailVerification(contributor)
        return errorResponse(res, 400, 'Verify Your Email to access your account')
      }

      const { access_token, refreshToken } = await generateToken(contributor)

      // // Assigning refresh token in http-only cookie
      // res.cookie('jwt', refreshToken, {
      //   httpOnly: true,
      //   sameSite: 'None',
      //   secure: true,
      //   maxAge: 24 * 60 * 60 * 1000
      // })

      // contributor.token = access_token
      const newContributor = { user:contributor, access_token, refreshToken }
      return successResponse(res, 200, 'login successfully! ', newContributor)
    }
    return errorResponse(res, 400, 'Invalid Credentials')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const verifyUser = async (req, res) => {
  try {
    const contributor = await Contributor.findOne({
      confirmationCode: req.params.confirmationCode
    })
    if (contributor) {
      contributor.isVerified = 'verified'
      await contributor.save()
      return successResponse(res, 200, 'Email Verification Sucessfully!')
    }
    return errorResponse(res, 404, 'Invalid link')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

// pending review
const refreshToken = async (req, res) => {
  try {
    // Destructuring refreshToken from cookie //use the cookie method
    const { refreshToken } = req.body

    // Verifying refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT_SECRET)
    if (!decoded) return errorResponse(res, 401, 'Unauthorized')

    const accessToken = jwt.sign(
      {
        id: decoded.id
      },
      process.env.ACCESS_TOKEN_JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )
    return res.json({ accessToken })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const { error } = forgotpasswordValidation(req.body)
    if (error) return errorResponse(res, 400, error.details[0].message)

    const contributor = await Contributor.findOne({ email })
    if (!contributor) {
      return errorResponse(res, 400, 'Email not found')
    }
    // Send reset link
    let response = await passwordResetLink(contributor)
    if (response) {
      return successResponse(res, 200, 'Reset link sent to your email', email)
    }
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const verifyResetLink = async (req, res) => {
  try {
    const contributor = await Contributor.findOne({
      token: req.params.resetCode
    })
    if (contributor) {
      return successResponse(res, 200, 'valid link!')
    }
    return errorResponse(res, 404, 'Invalid link or expired')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { error } = resetpasswordValidation(req.body)
    if (error) return errorResponse(res, 400, error.details[0].message)
    console.log(req.params.resetCode)
    const contributor = await Contributor.findOne({
      token: req.params.resetCode
    })
    if (contributor) {
      // Encrypt password
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
      contributor.password = passwordHash
      contributor.token = null
      await contributor.save()
      return successResponse(res, 200, 'Password reset sucessfully!', {
        password: req.body.password
      })
    }
    return errorResponse(res, 404, 'Invalid link or expired')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
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
// work on validation error message
