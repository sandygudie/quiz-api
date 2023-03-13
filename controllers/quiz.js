const mongoose = require('mongoose')
const Quiz = require('../models/quiz')

/**
 * Get Quizzes
 *
 * To get all quiz data
 * The quiz data is sorted in desc based on the created date
 *
 * @returns {object} quiz
 */
const getAllQuiz = async (req, res) => {
  const quiz = await Quiz.find({}).sort({ createdAt: -1 })
  res.status(200).json(quiz)
}

/**
 * Get a particular quiz data
 *
 * @param {number} req.params.id
 *
 * @returns {object} quiz
 */
const getQuiz = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error('invalid request')
  }
  const quiz = await Quiz.findById(id)
  if (!quiz) {
    throw Error('quiz not found')
  }
  res.status(200).json(quiz)
}

/**
 * To create a new quiz
 *
 * @param {string}  req.body.category
 * @param {string}  req.body.difficulty
 * @param {string}  req.body.question
 * @param {array}  req.body.incorrect_answers
 * @param {string}  req.body.correct_answer
 *
 * @return {object} quiz created
 */
const createQuiz = async (req, res) => {
  const { category, difficulty, question, incorrect_answers, correct_answer } = req.body
  if (!req.body) {
    throw Error('no request body')
  }
  try {
    const quiz = await Quiz.create({
      category,
      difficulty,
      question,
      incorrect_answers,
      correct_answer
    })
    res.status(200).json({ message: 'Question added', quiz })
  } catch (error) {
    throw Error(error)
  }
}

/**
 * Delete a quiz
 *
 * @param {number} req.params.id
 *
 * @returns {object} res.message
 */
const deleteQuiz = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error('invalid request')
  }

  const quiz = await Quiz.findOneAndDelete({ _id: id })
  if (!quiz) {
    return res.status(400).json({ error: 'quiz not found' })
  }

  res.status(200).json({ message: 'Question deleted' })
}

/**
 * Update a quiz
 *
 * @param {number} req.params.id
 *
 * @returns {object} updatedQuiz
 */
const updateQuiz = async (req, res) => {
  // if (!req.body) {
  //   throw Error('no request body')
  // }
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error('invalid request')
  }
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: 'query'
    })
    res.status(200).json({ message: 'Question updated', updatedQuiz })
  } catch (error) {
    throw Error('request failed')
  }
}

module.exports = {
  getAllQuiz,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz
}
