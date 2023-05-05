const mongoose = require('mongoose')
const AllQuiz = require('../models/quiz')
const Contributor = require('../models/contributor')
const ContributorQuiz = require('../models/contributorQuiz')

const { errorResponse, successResponse } = require('../utils/responseHandler')

const getAllQuizzes = async (req, res) => {
  try {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10
    let quizs
    if (req.query.difficulty && req.query.category) {
      const { difficulty, category } = req.query
      quizs = await AllQuiz.find({ category: category, difficulty: difficulty }).limit(limit)
    } else if (req.query.category) {
      const { category } = req.query
      quizs = await AllQuiz.find({ category: category.trim() }).limit(limit)
    } else if (req.query.difficulty) {
      const { difficulty } = req.query
      quizs = await AllQuiz.find({ difficulty: difficulty.trim() }).limit(limit)
    } else {
      quizs = await AllQuiz.find({}).sort({ createdAt: -1 }).limit(limit)
    }
    if (quizs.length === 0) {
      return successResponse(res, 200, 'No existing quizzes', quizs)
    }
    return successResponse(res, 200, 'Quizzes retrieved successfully', quizs)
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const getAllContributorQuizzes = async (req, res) => {
  try {
    const contributorQuizs = await ContributorQuiz.find({}).populate('contributor', { username: 1 })
    return successResponse(res, 200, 'Contributor Quizs retrieved successfully', contributorQuizs)
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const getQuiz = async (req, res) => {
  try {
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
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const createQuiz = async (req, res) => {
  try {
    let Quiz = req.quiz
    let { id, role } = req.user
    const { category, difficulty, question, incorrect_answers, correct_answer } = req.body
    if (!req.body) {
      return errorResponse(res, 400, 'no request body')
    }
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
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const deleteQuiz = async (req, res) => {
  try {
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
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const updateQuiz = async (req, res) => {
  try {
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
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

module.exports = {
  getAllQuizzes,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getAllContributorQuizzes
}
