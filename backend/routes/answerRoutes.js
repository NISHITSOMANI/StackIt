const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
    voteAnswer,
    acceptAnswer,
    updateAnswer,
    deleteAnswer,
} = require("../controllers/answerController");
const { validateVote, validateAnswer } = require("../middlewares/validationMiddleware");

// Vote on an answer (upvote/downvote)
router.post("/:id/vote", auth, validateVote, voteAnswer);

// Accept an answer
router.post("/:id/accept", auth, acceptAnswer);

// Update an answer
router.put("/:id", auth, validateAnswer, updateAnswer);

// Delete an answer
router.delete("/:id", auth, deleteAnswer);

module.exports = router;
