const Router = require('express')
const {
  getAllContributors,
  getAContributor,
  deleteAContributor,
  updateAContributor,
  verifyAContributorQuiz
} = require('../controllers/contributor')
const { verifyUserIsAdmin, verifyUserIsContibutorOrAdmin } = require('../middlewares/userCheck')

const contributorRouter = Router()
contributorRouter.get('/', verifyUserIsAdmin, getAllContributors)
contributorRouter.get('/:id', verifyUserIsContibutorOrAdmin, getAContributor)
contributorRouter.delete('/:id', verifyUserIsContibutorOrAdmin, deleteAContributor)
contributorRouter.patch('/:id', verifyUserIsContibutorOrAdmin, updateAContributor)
contributorRouter.post('/:quizId', verifyUserIsAdmin, verifyAContributorQuiz)

module.exports = { contributorRouter }

// the admin has the action for all this
// you have to be verified through email to be able to make any request
