const quizRoute = require('./quiz')

module.exports = function (app) {
  app.use('/api/v1/quiz', quizRoute)
}
