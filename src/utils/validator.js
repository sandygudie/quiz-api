const Joi = require('joi')

function userValidation(data) {
  const schema = Joi.object({
    username: Joi.string().required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required().trim()
  })
  return schema.validate(data)
}

function loginValidation(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required().trim()
  })
  return schema.validate(data)
}

function quizValidation(data) {
  const schema = Joi.object({
    question: Joi.string().required().trim(),
    incorrect_answers: Joi.a.required().trim(),
    correct_answer: Joi.array().required().trim(),
    category: Joi.string().required().trim(),
    difficulty: Joi.string().required().trim()
  })
  return schema.validate(data)
}
function forgotpasswordValidation(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim()
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

module.exports = {
  userValidation,
  loginValidation,
  quizValidation,
  forgotpasswordValidation,
  resetpasswordValidation
}

// provide custom error message
