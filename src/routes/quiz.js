const Router = require('express')
const {
  getAllQuizzes,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getAllContributorQuizzes
} = require('../controllers/quiz')
const {
  userDataIsContibutorOrAdmin,
  verifyUserIsAdmin,
  isUserVerified
} = require('../middlewares/userCheck')
const { verifyToken } = require('../middlewares/token')

const quizRouter = Router()
quizRouter.get('', getAllQuizzes)

// admin task
quizRouter.get(
  '/contributors',
  verifyToken,
  isUserVerified,
  verifyUserIsAdmin,
  getAllContributorQuizzes
)
quizRouter.get('/:id', verifyToken, isUserVerified, userDataIsContibutorOrAdmin, getQuiz)
quizRouter.post('/', verifyToken, isUserVerified, userDataIsContibutorOrAdmin, createQuiz)
quizRouter.delete('/:id', verifyToken, isUserVerified, userDataIsContibutorOrAdmin, deleteQuiz)
quizRouter.patch('/:id', verifyToken, isUserVerified, userDataIsContibutorOrAdmin, updateQuiz)

module.exports = { quizRouter }

