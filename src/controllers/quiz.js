const mongoose = require('mongoose')
const AllQuiz = require('../models/quiz')

const { errorResponse, successResponse } = require('../utils/responseHandler')

const getAllQuizs = async (req, res) => {

  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10
  let quizs
  if (req.query.category) {
    const { category } = req.query
    quizs = await AllQuiz.find({ category: category.trim() }).limit(limit)
  }
  if (req.query.difficulty) {
    const { difficulty } = req.query
    quizs = await AllQuiz.find({ difficulty: difficulty.trim() }).limit(limit)
  }
  if (req.query.difficulty && req.query.category) {
    const { difficulty, category } = req.query
    quizs = await AllQuiz.find({ category: category, difficulty: difficulty }).limit(limit)
  } else {
    quizs = await AllQuiz.find({}).sort({ createdAt: -1 }).limit(limit)
  }
  if (quizs.length === 0) {
    return successResponse(res, 200, 'quiz not found', quizs)
  }
  return successResponse(res, 200, 'Users retrieved successfully', quizs)
}

const getAQuiz = async (req, res) => {
  let Quiz = req.quiz
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

const createAQuiz = async (req, res) => {
  let Quiz = req.quiz
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

const deleteAQuiz = async (req, res) => {
  let Quiz = req.quiz
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


const updateAQuiz = async (req, res) => {
  let Quiz = req.quiz
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


