const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
    createQuestion,
    getAllQuestions,
    getQuestionById,
} = require("../controllers/questionController");

router.post("/", auth, createQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);

module.exports = router;
