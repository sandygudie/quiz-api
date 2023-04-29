const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/responseHandler')

const generateToken = async (user) => {
  const access_token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_JWT_SECRET,
    {
      expiresIn: '24hr'
    }
  )
  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_TOKEN_JWT_SECRET,
    {
      expiresIn: '1d'
    }
  )

  return { access_token, refreshToken }
}

const verifyToken = (req, res, next) => {
  const bearerToken = req.headers.authorization
  if (!bearerToken || !(bearerToken.search('Bearer ') === 0)) {
    return errorResponse(res, 401, 'Unauthorized')
  }
  const token = bearerToken.split(' ')[1]
  if (!token) return errorResponse(res, 401, 'Unauthorized')

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET)
    if (!decoded) return errorResponse(res, 401, 'Unauthorized')
    req.user = decoded
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Link Expired')
    } else {
      return errorResponse(res, 401, 'Invalid Link')
    }
  }
  return next()
}

module.exports = { generateToken, verifyToken }
