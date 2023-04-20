const Router = require('express')
const {
  getAllQuizs,
  getAQuiz,
  createAQuiz,
  deleteAQuiz,
  updateAQuiz
} = require('../controllers/quiz')

const quizRouter = Router()
quizRouter.get('', getAllQuizs)

// admin task
quizRouter.get('/:id', getAQuiz)
quizRouter.post('/', createAQuiz)
quizRouter.delete('/:id', deleteAQuiz)
quizRouter.patch('/:id', updateAQuiz)

module.exports = { quizRouter }
