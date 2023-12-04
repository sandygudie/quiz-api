const mongoose = require('mongoose')
const Contributor = require('../models/contributor')
const ContributorQuiz = require('../models/contributorQuiz')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { userValidation } = require('../utils/validator')

const getAllContributors = async (req, res) => {
  const contributor = await Contributor.find({ role: 'contributor' })
    .select('username role email isVerified')
    .sort({ createdAt: -1 })
  return successResponse(res, 200, ' Contributors retrieved successfully', contributor)
}

const getContributor = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid request')
  }
  const contributor = await Contributor.findById(id)
  if (!contributor) {
    return errorResponse(res, 400, ' Contributor not found')
  }
  return successResponse(res, 200, ' Contributor retrieved successfully', contributor)
}

// paginated quiz
// const getContributorQuizzes = async (req, res) => {
//   const { id } = req.params
//   const pageNumber = parseInt(req.query.pageNumber) || 1
//   const limit = parseInt(req.query.limit) || 5

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return errorResponse(res, 400, 'Invalid request')
//   }
//   const result = {}
//   let startIndex = pageNumber * limit
//   const endIndex = (pageNumber + 1) * limit

//   const contributor = await Contributor.findById(id)
//   if (!contributor) {
//     return errorResponse(res, 400, ' Contributor not found')
//   }

//   const totalQuiz = (await contributor.populate('quiz')).quiz.length

//   let contributorQuiz = await contributor.populate({
//     path: 'quiz',
//     options: { sort: { createdAt: -1 }, skip: startIndex, limit: limit }
//   })

//   result.quiz = contributorQuiz.quiz
//   result.totalQuiz = totalQuiz
//   result.limit = limit
//   result.currentPage = pageNumber

//   result.previousPage = startIndex > 0 ? pageNumber - 1 : null

//   result.nextPage = endIndex < totalQuiz ? pageNumber + 1 : null

//   return successResponse(res, 200, ' Contributor retrieved successfully', result)
// }

const getContributorQuizzes = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid request')
  }
  const contributor = await Contributor.findById(id)
  if (!contributor) {
    return errorResponse(res, 400, ' Contributor not found')
  }
  let contributorQuiz = (
    await contributor.populate({
      path: 'quiz',
      options: {
        sort: { createdAt: -1 }
      }
    })
  ).quiz
  let result
  const { difficulty, category, status } = req.query
  if (req.query.category && req.query.difficulty && req.query.status) {
    result = contributorQuiz.filter(
      (ele) => ele.category === category && ele.difficulty === difficulty && ele.status === status
    )
  } else if (difficulty && category) {
    result = contributorQuiz.filter(
      (ele) => ele.category === category && ele.difficulty === difficulty
    )
  } else if (status && category) {
    result = contributorQuiz.filter((ele) => ele.category === category && ele.status === status)
  } else if (status && difficulty) {
    result = contributorQuiz.filter((ele) => ele.difficulty === difficulty && ele.status === status)
  } else if (req.query.category || req.query.difficulty || req.query.status) {
    result = contributorQuiz.filter((ele) =>
      category
        ? ele.category === category
        : difficulty
          ? ele.difficulty === difficulty
          : ele.status === status
    )
  } else {
    result = [...contributorQuiz]
  }
  if (result.length === 0) {
    return successResponse(res, 200, 'No existing quizzes', result)
  }
  return successResponse(res, 200, 'Quizzes retrieved successfully', result)
}

const deleteContributor = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid request')
  }
  const contributor = await Contributor.findOneAndDelete({ _id: id })
  if (!contributor) {
    return errorResponse(res, 400, ' Contributor not found')
  }
  return successResponse(res, 200, ' Contributor deleted')
}

const updateContributor = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid request')
  }
  const { error } = userValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  const updatedContributor = await Contributor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return successResponse(res, 200, 'Contributor updated', updatedContributor)
}

const verifyContributorQuiz = async (req, res) => {
  const { quizId } = req.params
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return errorResponse(res, 400, 'Invalid request')
  }
  const contributor = await ContributorQuiz.findById(quizId)
  if (!contributor) {
    return errorResponse(res, 400, 'Contributor quiz not found')
  }
  contributor.status = 'verified'
  const updatedContributorstatus = await contributor.save()
  return successResponse(res, 200, 'Contributor quiz verified', updatedContributorstatus)
}

module.exports = {
  getAllContributors,
  getContributor,
  deleteContributor,
  updateContributor,
  verifyContributorQuiz,
  getContributorQuizzes
}
