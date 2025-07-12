const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    voteQuestion,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionController");
const { submitAnswer } = require("../controllers/answerController");
const { validateQuestion, validateVote, validateAnswer } = require("../middlewares/validationMiddleware");

// Get all questions
router.get("/", getAllQuestions);

// Get question by ID
router.get("/:id", getQuestionById);

// Create a new question
router.post("/", auth, validateQuestion, createQuestion);

// Vote on a question (upvote/downvote)
router.post("/:id/vote", auth, validateVote, voteQuestion);

// Update a question
router.put("/:id", auth, validateQuestion, updateQuestion);

// Delete a question
router.delete("/:id", auth, deleteQuestion);

// Submit an answer to a question
router.post("/:id/answers", auth, validateAnswer, submitAnswer);

module.exports = router;
