const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
    createQuestion,
    getAllQuestions,
    getQuestionById,
} = require("../controllers/questionController");

// POST /questions
router.post("/", auth, createQuestion);

// GET /questions
router.get("/", getAllQuestions);

// GET /questions/:id
router.get("/:id", getQuestionById);

module.exports = router;
