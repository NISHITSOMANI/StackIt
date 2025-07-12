const Answer = require("../models/Answer");
const Question = require("../models/Question");

exports.submitAnswer = async (req, res) => {
    try {
        const { description } = req.body;
        const questionId = req.params.id;

        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: "Question not found" });

        const answer = await Answer.create({
            content: description,
            user: req.user.id,
            question: questionId,
        });

        question.answers.push(answer._id);
        await question.save();

        res.status(201).json({
            message: "Answer submitted",
            answerId: answer._id,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to submit answer", error: err.message });
    }
};

exports.voteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) return res.status(404).json({ message: "Answer not found" });

        const { vote } = req.body;

        if (vote === 1) {
            answer.upvotes += 1;
        } else if (vote === -1) {
            answer.downvotes += 1;
        } else {
            return res.status(400).json({ message: "Invalid vote value. Use 1 or -1." });
        }

        await answer.save();

        res.json({
            message: "Vote registered",
            upvotes: answer.upvotes,
            downvotes: answer.downvotes,
        });
    } catch (err) {
        res.status(500).json({ message: "Vote failed", error: err.message });
    }
};

exports.acceptAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id).populate("question");
        if (!answer) return res.status(404).json({ message: "Answer not found" });

        const question = await Question.findById(answer.question._id);
        if (!question) return res.status(404).json({ message: "Question not found" });

        if (question.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only question owner can accept an answer" });
        }

        question.acceptedAnswer = answer._id;
        await question.save();

        res.json({ message: "Answer marked as accepted" });
    } catch (err) {
        res.status(500).json({ message: "Accepting answer failed", error: err.message });
    }
};
