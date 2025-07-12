const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
    submitAnswer,
    voteAnswer,
    acceptAnswer,
} = require("../controllers/answerController");

// Submit an answer to a question
router.post("/questions/:id/answers", auth, submitAnswer);

// Vote on an answer (upvote/downvote)
router.post("/answers/:id/vote", auth, voteAnswer);

// Accept an answer as best
router.post("/answers/:id/accept", auth, acceptAnswer);

module.exports = router;
