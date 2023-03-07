const express = require("express");
const {
  getAllQuiz,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz,
} = require("../controllers/quiz");

const router = express.Router();
router.get("/", getAllQuiz);
router.get("/:id", getQuiz);
router.post("/", createQuiz);
router.delete("/:id", deleteQuiz);
router.patch("/:id", updateQuiz);

module.exports = router;
