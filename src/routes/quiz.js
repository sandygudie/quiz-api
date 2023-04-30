const Router = require('express')
const {
  getAllQuizs,
  getAQuiz,
  createAQuiz,
  deleteAQuiz,
  updateAQuiz,
  getAllContributorQuizs
} = require('../controllers/quiz')
const {
  userDataIsContibutorOrAdmin,
  verifyUserIsAdmin,
  isUserVerified
} = require('../middlewares/userCheck')
const { verifyToken } = require('../middlewares/token')

const quizRouter = Router()
quizRouter.get('', getAllQuizs)

// admin task
quizRouter.get(
  '/contributors',
  verifyToken,
  isUserVerified,
  verifyUserIsAdmin,
  getAllContributorQuizs
)
quizRouter.get('/:id', verifyToken, isUserVerified, userDataIsContibutorOrAdmin, getAQuiz)
quizRouter.post('/', verifyToken, isUserVerified, userDataIsContibutorOrAdmin, createAQuiz)
quizRouter.delete('/:id', verifyToken, isUserVerified, userDataIsContibutorOrAdmin, deleteAQuiz)
quizRouter.patch('/:id', verifyToken, isUserVerified, userDataIsContibutorOrAdmin, updateAQuiz)

module.exports = { quizRouter }

// only The admin has the action to post, delete and edit and get
// Endpoint users can get only get all the quiz

// you have to be verified through email to be able to make any request
