const { errorResponse, catchAsyncError } = require('../utils/responseHandler')
const Quiz = require('../models/quiz')
const ContributorQuiz = require('../models/contributorQuiz')
const Contributor = require('../models/contributor')
const mongoose = require('mongoose')

const userDataIsContibutorOrAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user) {
    const { role } = req.user
    if (role === 'contributor') {
      req.quiz = ContributorQuiz
      return next()
    }
    if (role === 'admin') {
      req.quiz = Quiz
      return next()
    }
  }
  return errorResponse(res, 403, 'User is not authorized to perform this action')
})

const verifyUserIsAdmin = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role !== 'admin') {
    return errorResponse(res, 403, 'User is not authorized to perform this action')
  }
  return next()
})
const verifyUserIsContibutorOrAdmin = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role === 'admin' || role === 'contributor') {
    return next()
  }

  return errorResponse(res, 403, 'User is not authorized to perform this action')
})

const isUserVerified = catchAsyncError(async (req, res, next) => {
  const { id } = req.user
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const contributorOrAdmin = await Contributor.findById(id)
  if (!contributorOrAdmin) {
    return errorResponse(res, 403, 'Contributor Or Admin not found')
  }
  if (contributorOrAdmin.isVerified === 'pending') {
    return errorResponse(res, 403, 'Account not verified')
  }
  return next()
})

module.exports = {
  verifyUserIsAdmin,
  userDataIsContibutorOrAdmin,
  isUserVerified,
  verifyUserIsContibutorOrAdmin
}
