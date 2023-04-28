const Router = require('express')
const {
  getAllQuizs,
  getAQuiz,
  createAQuiz,
  deleteAQuiz,
  updateAQuiz
} = require('../controllers/quiz')
const { userDataIsContibutorOrAdmin } = require('../middlewares/userCheck')
const { verifyToken } = require('../middlewares/token')

const quizRouter = Router()
quizRouter.get('', getAllQuizs)

// admin task
quizRouter.get('/:id', getAQuiz)
quizRouter.post('/', verifyToken, userDataIsContibutorOrAdmin, createAQuiz)
quizRouter.delete('/:id', verifyToken, userDataIsContibutorOrAdmin, deleteAQuiz)
quizRouter.patch('/:id', verifyToken, userDataIsContibutorOrAdmin, updateAQuiz)

module.exports = { quizRouter }

// only The admin has the action to post, delete and edit and get
// Endpoint users can get only get all the quiz
