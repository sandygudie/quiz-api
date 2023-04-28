const Router = require('express')
const {
  getAllContributors,
  getAContributor,
  deleteAContributor,
  updateAContributor
} = require('../controllers/contributor')
const { verifyUserIsAdmin,verifyUserIsContibutorOrAdmin } = require('../middlewares/userCheck')


const contributorRouter = Router()
contributorRouter.get('/', verifyUserIsAdmin, getAllContributors)
contributorRouter.get('/:id', verifyUserIsAdmin, getAContributor)
contributorRouter.delete('/:id', verifyUserIsContibutorOrAdmin, deleteAContributor)
contributorRouter.patch('/:id', verifyUserIsContibutorOrAdmin, updateAContributor)

module.exports = { contributorRouter }

// the admin has the action for all this
