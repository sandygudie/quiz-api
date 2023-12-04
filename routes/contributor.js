const Router = require('express')
const {
  getAllContributors,
  getContributor,
  deleteContributor,
  updateContributor,
  verifyContributorQuiz,
  getContributorQuizzes
} = require('../controllers/contributor')
const { verifyUserIsAdmin, verifyUserIsContibutorOrAdmin } = require('../middlewares/userCheck')

const contributorRouter = Router()
contributorRouter.get('/', verifyUserIsAdmin, getAllContributors)
contributorRouter.get('/:id', verifyUserIsContibutorOrAdmin, getContributor)
contributorRouter.delete('/:id', verifyUserIsContibutorOrAdmin, deleteContributor)
contributorRouter.patch('/:id', verifyUserIsContibutorOrAdmin, updateContributor)
contributorRouter.post('/:quizId', verifyUserIsAdmin, verifyContributorQuiz)
contributorRouter.get('/:id/quiz', verifyUserIsContibutorOrAdmin, getContributorQuizzes)

module.exports = { contributorRouter }
