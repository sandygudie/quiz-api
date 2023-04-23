const mongoose = require('mongoose')
const Quiz = require('../models/quiz')
const { errorResponse, successResponse } = require('../utils/responseHandler')

/**
 * To get all quizs data
 * The quiz data is sorted in desc based on the created date
 * @returns {object} quiz
 */

const getAllQuizs = async (req, res) => {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10
  let quizs
  if (req.query.category) {
    const { category } = req.query
    quizs = await Quiz.find({ category: category.trim() }).limit(limit)
  }
  if (req.query.difficulty) {
    const { difficulty } = req.query
    quizs = await Quiz.find({ difficulty: difficulty.trim() }).limit(limit)
  }
  if (req.query.difficulty && req.query.category) {
    const { difficulty, category } = req.query
    quizs = await Quiz.find({ category: category, difficulty: difficulty }).limit(limit)
  } else {
    quizs = await Quiz.find({}).sort({ createdAt: -1 }).limit(limit)
  }
  if (quizs.length === 0) {
    return successResponse(res, 200, 'quiz not found', quizs)
  }
  return successResponse(res, 200, 'Users retrieved successfully', quizs)
}

/**
 * Get a particular quiz data
 * @param {number} req.params.id
 * @returns {object} quiz
 */
const getAQuiz = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const quiz = await Quiz.findById(id)
  if (!quiz) {
    return errorResponse(res, 400, 'Quiz not found')
  }
  return successResponse(res, 200, 'Quiz retrieved successfully', quiz)
}

/**
 * To create a new quiz
 * @param {string}  req.body.category
 * @param {string}  req.body.difficulty
 * @param {string}  req.body.question
 * @param {array}  req.body.incorrect_answers
 * @param {string}  req.body.correct_answer
 * @return {object} quiz created
 */
const createAQuiz = async (req, res) => {
  const { category, difficulty, question, incorrect_answers, correct_answer } = req.body
  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }
  const quiz = await Quiz.create({
    category,
    difficulty,
    question,
    incorrect_answers,
    correct_answer
  })
  return successResponse(res, 201, 'Quiz created successfully', quiz)
}

/**
 * Delete a quiz
 * @param {number} req.params.id
 * @returns {object} res.message
 */
const deleteAQuiz = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const quiz = await Quiz.findOneAndDelete({ _id: id })
  if (!quiz) {
    return errorResponse(res, 400, 'Quiz not found')
  }
  return successResponse(res, 200, 'Quiz deleted')
}

/**
 * Update a quiz
 * @param {number} req.params.id
 * @returns {object} updatedQuiz
 */
const updateAQuiz = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'invalid request')
  }
  const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return successResponse(res, 200, 'Quiz updated', updatedQuiz)
}

module.exports = {
  getAllQuizs,
  getAQuiz,
  createAQuiz,
  deleteAQuiz,
  updateAQuiz
}
// Todo
// only Admin should be able delete and update a quiz
// sign in users should be able to create quiz
// everyone can get a quiz
