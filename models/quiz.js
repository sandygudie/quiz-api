const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  incorrect_answers: {
    type: Array,
    required: true,
  },
  correct_answer: {
    type: String,
    required: true,
  },
  date: Date,
});

quizSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
