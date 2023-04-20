const mongoose = require('mongoose')
const User = require('../models/users')
const { errorResponse, successResponse } = require('../utils/responseHandler')

/**
 * To get all Users data
 * The User data is sorted in desc based on the created date
 * @returns {object} User
 */
const getAllUsers = async (req, res) => {
  const Users = await User.find({}).sort({ createdAt: -1 })
  return successResponse(res, 200, 'Users retrieved successfully', Users)
}
/**
 * Get a particular User data
 * @param {number} req.params.id
 * @returns {object} User
 */
const getAUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const User = await User.findById(id)
  if (!User) {
    return errorResponse(res, 400, 'User not found')
  }
  return successResponse(res, 200, 'User retrieved successfully', User)
}

/**
 * Delete a User
 * @param {number} req.params.id
 * @returns {object} res.message
 */
const deleteAUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const User = await User.findOneAndDelete({ _id: id })
  if (!User) {
    return errorResponse(res, 400, 'User not found')
  }
  return successResponse(res, 200, 'User deleted')
}

/**
 * Update a User
 * @param {number} req.params.id
 * @returns {object} updatedUser
 */
const updateAUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return successResponse(res, 200, 'User updated', updatedUser)
}

module.exports = {
  getAllUsers,
  getAUser,
  deleteAUser,
  updateAUser
}
