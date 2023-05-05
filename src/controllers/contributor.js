const mongoose = require('mongoose')
const Contributor = require('../models/contributor')
const ContributorQuiz = require('../models/contributorQuiz')
const { errorResponse, successResponse } = require('../utils/responseHandler')

const getAllContributors = async (req, res) => {
  const contributor = await Contributor.find({ role: 'contributor' }).select('username role email isVerified')
  return successResponse(res, 200, ' Contributors retrieved successfully', contributor)
}

const getContributor = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const contributor = await Contributor.findById(id).populate('quiz')
  if (!contributor) {
    return errorResponse(res, 400, ' Contributor not found')
  }
  return successResponse(res, 200, ' Contributor retrieved successfully', contributor)
}

const deleteContributor = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const contributor = await Contributor.findOneAndDelete({ _id: id })
  if (!contributor) {
    return errorResponse(res, 400, ' Contributor not found')
  }
  return successResponse(res, 200, ' Contributor deleted')
}

const updateContributor = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const updatedContributor = await Contributor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return successResponse(res, 200, 'Contributor updated', updatedContributor)
}
const verifyContributorQuiz = async (req, res) => {
  const { quizId } = req.params

  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const contributor = await ContributorQuiz.findById(quizId)
  if (!contributor) {
    return errorResponse(res, 400, 'Contributor quiz not found')
  }
  contributor.status = 'verified'
  const updatedContributorstatus = await contributor.save()

  return successResponse(res, 200, 'Contributor quiz verified', updatedContributorstatus)
}

module.exports = {
  getAllContributors,
  getContributor,
  deleteContributor,
  updateContributor,
  verifyContributorQuiz
}
