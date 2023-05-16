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

module.exports = {
  userValidation,
  loginValidation,
  quizValidation
}
