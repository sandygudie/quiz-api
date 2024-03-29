const mongoose = require('mongoose')
const AllQuiz = require('../models/quiz')
const Contributor = require('../models/contributor')
const ContributorQuiz = require('../models/contributorQuiz')
const { quizValidation } = require('../utils/validator')
const { errorResponse, successResponse } = require('../utils/responseHandler')

const getAllQuizzes = async (req, res) => {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10
  let quizs
  if (req.query.difficulty && req.query.category) {
    const { difficulty, category } = req.query
    quizs = await AllQuiz.aggregate([
      { $match: { category: category, difficulty: difficulty } },
      { $sample: { size: limit } }
    ])
  } else if (req.query.category) {
    const { category } = req.query
    quizs = await AllQuiz.aggregate([
      { $match: { category: category } },
      { $sample: { size: limit } }
    ])
  } else if (req.query.difficulty) {
    const { difficulty } = req.query
    quizs = await AllQuiz.aggregate([
      { $match: { difficulty: difficulty } },
      { $sample: { size: limit } }
    ])
  } else {
    quizs = await AllQuiz.aggregate([{ $sample: { size: limit } }])
  }
  if (quizs.length === 0) {
    return successResponse(res, 200, 'No existing quizzes', quizs)
  }
  return successResponse(res, 200, 'Quizzes retrieved successfully', quizs)
}

const getAllContributorQuizzes = async (req, res) => {
  const contributorQuizs = await ContributorQuiz.find({})
    .populate('contributor', { username: 1 })
    .sort({ createdAt: -1 })
  return successResponse(res, 200, 'Contributor Quizzes retrieved successfully', contributorQuizs)
}

const getQuiz = async (req, res) => {
  let Quiz = req.quiz
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid request')
  }
  const quiz = await Quiz.findById(id)
  if (!quiz) {
    return errorResponse(res, 400, 'Quiz not found')
  }
  return successResponse(res, 200, 'Quiz retrieved successfully', quiz)
}

const createQuiz = async (req, res) => {
  let Quiz = req.quiz
  let { id, role } = req.user

  const { question, incorrect_answers, correct_answer, category, difficulty } = req.body
  if (!req.body) {
    return errorResponse(res, 400, 'No request body')
  }
  // console.log(req.body)
  const { error } = quizValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)

  const contributor = await Contributor.findById(id)
  const quiz = new Quiz({
    category,
    difficulty,
    question,
    incorrect_answers,
    correct_answer
  })
  role === 'contributor' ? (quiz.contributor = contributor._id) : ''
  role === 'contributor' ? (quiz.status = 'pending') : ''
  const savedQuiz = await quiz.save()
  contributor.quiz = contributor.quiz.concat(savedQuiz._id)
  await contributor.save()
  return successResponse(res, 201, 'Quiz created successfully', savedQuiz)
}

const deleteQuiz = async (req, res) => {
  let Quiz = req.quiz
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid request')
  }
  const quiz = await Quiz.findOneAndDelete({ _id: id })
  if (!quiz) {
    return errorResponse(res, 400, 'Quiz not found')
  }
  return successResponse(res, 200, 'Quiz deleted')
}

const updateQuiz = async (req, res) => {
  let Quiz = req.quiz
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid request')
  }
  const { error } = quizValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return successResponse(res, 200, 'Quiz updated', updatedQuiz)
}

module.exports = {
  getAllQuizzes,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getAllContributorQuizzes
}



