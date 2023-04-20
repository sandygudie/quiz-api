const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/responseHandler')

const generateToken = async (user) => {
  const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: 86400
  })
  return { access_token }
}

const verifyToken = (req, res, next) => {
  const bearerToken = req.headers.authorization
  if (!bearerToken || !(bearerToken.search('Bearer ') === 0)) {
    return errorResponse(res, 401, 'Unauthorized')
  }
  const token = bearerToken.split(' ')[1]
  if (!token) return errorResponse(res, 401, 'Unauthorized')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) return errorResponse(res, 401, 'Unauthorized')
    req.user = decoded
  } catch (error) {
    return errorResponse(res, 401, 'Invalid Token')
  }
  return next()
}

module.exports = { generateToken, verifyToken }
