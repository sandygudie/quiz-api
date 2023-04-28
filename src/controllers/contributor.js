const mongoose = require('mongoose')
const Contributor = require('../models/contributor')
const { errorResponse, successResponse } = require('../utils/responseHandler')

const getAllContributors = async (req, res) => {
  const contributor = await Contributor.find({ role: 'contributor' }).sort({ createdAt: -1 })
  return successResponse(res, 200, ' Contributors retrieved successfully', contributor)
}

const getAContributor = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const contributor = await Contributor.findById(id)
  if (!contributor) {
    return errorResponse(res, 400, ' Contributor not found')
  }
  return successResponse(res, 200, ' Contributor retrieved successfully', contributor)
}

const deleteAContributor = async (req, res) => {
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

const updateAContributor = async (req, res) => {
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

module.exports = {
  getAllContributors,
  getAContributor,
  deleteAContributor,
  updateAContributor
}
