const Answer = require("../models/Answer");
const Question = require("../models/Question");
const User = require("../models/User");
const Notification = require("../models/Notification");
const extractMentions = require("../utils/extractMentions");


exports.submitAnswer = async (req, res) => {
    try {
        const { description } = req.body;
        const questionId = req.params.id;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const answer = await Answer.create({
            content: description,
            user: req.user.id,
            question: questionId,
        });

        question.answers.push(answer._id);
        await question.save();

        // Create notification for question owner (if not answering their own question)
        if (question.user.toString() !== req.user.id) {
            try {
                const currentUser = await User.findById(req.user.id).select("username");
                await Notification.create({
                    recipient: question.user,
                    type: "answer",
                    message: `${currentUser.username} answered your question`,
                    link: `/questions/${question._id}`,
                });
            } catch (notifErr) {
                console.error("Notification creation failed:", notifErr.message);
            }
        }

        // Notify mentioned users in the answer description
        try {
            const mentionedUsernames = extractMentions(description);
            const currentUser = await User.findById(req.user.id).select("username");

            for (const username of mentionedUsernames) {
                const mentionedUser = await User.findOne({ username });
                if (mentionedUser && mentionedUser._id.toString() !== req.user.id) {
                    await Notification.create({
                        recipient: mentionedUser._id,
                        type: "mention",
                        message: `${currentUser.username} mentioned you in an answer`,
                        link: `/questions/${question._id}`
                    });
                }
            }
        } catch (mentionErr) {
            console.error("Mention notification error:", mentionErr.message);
        }

        // Single final response
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
