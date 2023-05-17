const mongoose = require('mongoose')

const contributorQuizSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['HTML', 'CSS', 'Javascript'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    question: {
      trim: true,
      type: String,
      required: true
    },
    incorrect_answers: {
      type: Array,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'verified'],
      default: 'pending'
    },
    contributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contributor'
    }
  },
  { timestamps: true },
  {
    collection: 'contributor-quizzes'
  }
)

contributorQuizSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('ContributorQuiz', contributorQuizSchema)
