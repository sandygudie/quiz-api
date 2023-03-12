const mongoose = require("mongoose");
const Quiz = require("../models/quiz");

const getAllQuiz = async (req, res) => {
  const quiz = await Quiz.find({}).sort({ createdAt: -1 });
  res.status(200).json(quiz);
};

const getQuiz = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("invalid request");
  }
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw Error("quiz not found");
  }
  res.status(200).json(quiz);
};

const createQuiz = async (req, res) => {
  const { category, difficulty, question, incorrect_answers, correct_answer } =
    req.body;
  if (!req.body) {
    throw Error("no request body");
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
    throw Error(error.name);
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("invalid request");
  }

  const quiz = await Quiz.findOneAndDelete({ _id: id });
  if (!quiz) {
    return res.status(400).json({ error: "quiz not found" });
  }

  res.status(200).json({ message: "Question deleted" });
};

const updateQuiz = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("invalid request");
  }
  if (!req.body) {
    throw Error("no request body");
  }
  const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: "query",
  });

  if (!updatedQuiz) {
    return res.status(400).json({ error: "quiz not found" });
  }
  res.status(200).json({ message: "Question updated", updatedQuiz });
};

module.exports = {
  getAllQuiz,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz,
};
