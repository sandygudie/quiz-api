const mongoose = require("mongoose");
const Quiz = require("../models/quiz");
const asyncWrapper = require("../utils/async_wrapper");

const getAllQuiz = asyncWrapper(async (req, res) => {
  const quiz = await Quiz.find({}).sort({ createdAt: -1 });
  res.status(200).json(quiz);
});

const getQuiz = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such quiz" });
  }

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    return res.status(404).json({ error: "No such quiz" });
  }
  res.status(200).json(quiz);
});

const createQuiz = asyncWrapper(async (req, res) => {
  const {
    category, difficulty, question, incorrect_answers, correct_answer,
  } = req.body;
  if (!req.body) {
    return res.status(400).json({
      error: "no request body",
    });
  }

  try {
    const quiz = await Quiz.create({
      category,
      difficulty,
      question,
      incorrect_answers,
      correct_answer,
    });
    res.status(200).json({ message: "Question added", quiz });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const deleteQuiz = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such quiz" });
  }

  const quiz = await Quiz.findOneAndDelete({ _id: id });

  if (!quiz) {
    return res.status(400).json({ error: "No such quiz" });
  }

  res.status(200).json({ message: "Question deleted" });
});

const updateQuiz = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such quiz" });
  }

  const quiz = await Quiz.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
  );

  if (!quiz) {
    return res.status(400).json({ error: "No such quiz" });
  }

  res.status(200).json({ message: "Question updated", quiz });
});

module.exports = {
  getAllQuiz,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz,
};
