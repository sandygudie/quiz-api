const mongoose = require('mongoose')

const contributorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      minlength: 5,
      required: true
    },
    role: {
      type: String,
      enum: ['contributor', 'admin'],
      default: 'contributor',
      required: true
    },
    quiz: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContributorQuiz'
      }
    ],
    isVerified: {
      type: String,
      enum: ['pending', 'verified'],
      default: 'pending'
    },
    confirmationCode: {
      type: String,
      unique: true
    }
  },
  { timestamps: true },
  {
    collection: 'contributors'
  }
)

contributorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

const Contributor = mongoose.model('Contributor', contributorSchema)

module.exports = Contributor
