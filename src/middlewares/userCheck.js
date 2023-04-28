const { errorResponse } = require('../utils/responseHandler')
const Quiz = require('../models/quiz')
const ContributorQuiz = require('../models/contributorQuiz')

const userDataIsContibutorOrAdmin = async (req, res, next) => {
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
}

const verifyUserIsAdmin = async (req, res, next) => {
  const { role } = req.user
  if (role !== 'admin') {
    return errorResponse(res, 403, 'User is not authorized to perform this action')
  }
  return next()
}
const verifyUserIsContibutorOrAdmin = async (req, res, next) => {
  const { role } = req.user
  if (role === 'admin' || role === 'contributor') {
    return next()
  }

  return errorResponse(res, 403, 'User is not authorized to perform this action')
}

module.exports = { verifyUserIsAdmin, userDataIsContibutorOrAdmin, verifyUserIsContibutorOrAdmin }
