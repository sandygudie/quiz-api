const Router = require('express')
const { getAllUsers, getAUser, deleteAUser, updateAUser } = require('../controllers/user')

const userRouter = Router()
userRouter.get('/', getAllUsers)
userRouter.get('/:id', getAUser)
userRouter.delete('/:id', deleteAUser)
userRouter.patch('/:id', updateAUser)

module.exports = { userRouter }
