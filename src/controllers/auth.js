const Contributor = require('../models/contributor')
const bcrypt = require('bcrypt')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { generateToken } = require('../middlewares/token')
const { emailVerification } = require('../utils/sendEmail/emailhandler')
const jwt = require('jsonwebtoken')



const register = async (req, res) => {
  const { username, email, password } = req.body
  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }
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
  // Generate token
  const { access_token } = await generateToken(contributor)
  contributor.token = access_token

  const newContributor = await contributor.save()

  // Send verification link
  await emailVerification(newContributor)

  return successResponse(
    res,
    201,
    'User was registered successfully! Please check your email',
    newContributor
  )
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }
  const contributor = await Contributor.findOne({ email })

  if (contributor && (await bcrypt.compare(password, contributor.password))) {
    if (contributor.isVerified === 'pending') {
      await emailVerification(contributor)
      return errorResponse(res, 400, 'Verify Your Email to access your account')
    }

    const { access_token, refreshToken } = await generateToken(contributor)

    // Assigning refresh token in http-only cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    contributor.token = access_token
    const newContributor = await contributor.save()
    return successResponse(res, 200, 'login successfully! ', newContributor)
  }
  return errorResponse(res, 400, 'Invalid Credentials')
}

const verifyUser = async (req, res) => {

  const contributor= await Contributor.findOne({
    token: req.params.confirmationCode
  })
  if (contributor) {
    contributor.isVerified = 'verified'
    await contributor.save()
    return successResponse(res, 200, 'Email Verification Sucessfully!')
  }
  return errorResponse(res, 404, 'Invalid link')
}


// pending review
const refreshToken = async (req, res) => {
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
}


module.exports = {
  register,
  verifyUser,
  login,
  refreshToken
}

// Todo
// review refresh token
// reset password
// forgot password
// work on validation error message
// get user profile
