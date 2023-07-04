const Joi = require('joi')

function userValidation(data) {
  const schema = Joi.object({
    username: Joi.string().required().trim().label('User Name'),
    email: Joi.string().email().required().lowercase().trim().label('Email'),
    password: Joi.string().required().trim().label('Password'),
    role: Joi.string().trim().label('role')
  })
  return schema.validate(data)
}

function loginValidation(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim().label('email'),
    password: Joi.string().required().trim().label('Password')
  })
  return schema.validate(data)
}

function quizValidation(data) {
  const schema = Joi.object({
    question: Joi.string().required().trim().label('Question'),
    incorrect_answers: Joi.array()
      .items(Joi.string().required().trim())
      .required()
      .label('Incorrect Answers'),
    correct_answer: Joi.string().required().trim().label('Correct Answer'),
    category: Joi.string().required().trim().label('Category'),
    difficulty: Joi.string().required().trim().label('Difficulty')
  })
  return schema.validate(data)
}
function forgotpasswordValidation(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim().label('Email')
  })
  return schema.validate(data)
}
function resetpasswordValidation(data) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(15).required().label('Password'),
    passwordConfirmation: Joi.string()
      .equal(Joi.ref('password'))
      .required()
      .trim()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' })
  })
  return schema.validate(data)
}
function refreshTokenValidation(data) {
  const schema = Joi.object({
    refreshToken: Joi.string().required().trim().label('Refresh Token')
  })
  return schema.validate(data)
}

module.exports = {
  userValidation,
  loginValidation,
  quizValidation,
  forgotpasswordValidation,
  resetpasswordValidation,
  refreshTokenValidation
}

// provide custom error message
