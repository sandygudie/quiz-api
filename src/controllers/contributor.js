const mongoose = require('mongoose')
const Contributor = require('../models/contributor')
const ContributorQuiz = require('../models/contributorQuiz')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { userValidation } = require('../utils/validator')

const getAllContributors = async (req, res) => {
  try {
    const contributor = await Contributor.find({ role: 'contributor' })
      .select('username role email isVerified')
      .sort({ createdAt: -1 })
    return successResponse(res, 200, ' Contributors retrieved successfully', contributor)
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const getContributor = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, 'invalid request')
    }
    const contributor = await Contributor.findById(id).populate({
      path: 'quiz',
      options: { sort: { createdAt: -1 } }
    })
    if (!contributor) {
      return errorResponse(res, 400, ' Contributor not found')
    }
    return successResponse(res, 200, ' Contributor retrieved successfully', contributor)
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const deleteContributor = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, 'invalid request')
    }
    const contributor = await Contributor.findOneAndDelete({ _id: id })
    if (!contributor) {
      return errorResponse(res, 400, ' Contributor not found')
    }
    return successResponse(res, 200, ' Contributor deleted')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const updateContributor = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, 'invalid request')
    }
    const { error } = userValidation(req.body)
    if (error) return errorResponse(res, 400, error.details[0].message)

    const updatedContributor = await Contributor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: 'query'
    })
    return successResponse(res, 200, 'Contributor updated', updatedContributor)
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}
const verifyContributorQuiz = async (req, res) => {
  try {
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
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

module.exports = {
  getAllContributors,
  getContributor,
  deleteContributor,
  updateContributor,
  verifyContributorQuiz
}
