const Answer = require("../models/Answer");
const Question = require("../models/Question");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Vote = require("../models/Vote");
const extractMentions = require("../utils/extractMentions");
const { filterContent, rankAnswers } = require("../services/aiService");


exports.submitAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const questionId = req.params.id;

        // Skip AI content filtering for now - accept all content
        console.log('Submitting answer with content:', content);

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const answer = await Answer.create({
            content: content, // Use original content without filtering
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

        // Notify mentioned users in the answer content
        try {
            const mentionedUsernames = extractMentions(content || '');
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

        // Check if user is voting on their own answer
        if (answer.user.toString() === req.user.id) {
            return res.status(400).json({ message: "You cannot vote on your own answer" });
        }

        const { vote } = req.body;
        if (vote !== 1 && vote !== -1) {
            return res.status(400).json({ message: "Invalid vote value. Use 1 or -1." });
        }

        // Check if user has already voted
        let existingVote = await Vote.findOne({
            user: req.user.id,
            targetType: "answer",
            targetId: req.params.id
        });

        if (existingVote) {
            // User has already voted
            if (existingVote.voteValue === vote) {
                // Same vote - remove it (undo vote)
                if (vote === 1) {
                    answer.upvotes -= 1;
                } else {
                    answer.downvotes -= 1;
                }
                await existingVote.deleteOne();
                await answer.save();

                res.json({
                    message: "Vote removed",
                    upvotes: answer.upvotes,
                    downvotes: answer.downvotes,
                    userVote: null
                });
            } else {
                // Different vote - change it
                if (existingVote.voteValue === 1) {
                    answer.upvotes -= 1;
                } else {
                    answer.downvotes -= 1;
                }

                if (vote === 1) {
                    answer.upvotes += 1;
                } else {
                    answer.downvotes += 1;
                }

                existingVote.voteValue = vote;
                await existingVote.save();
                await answer.save();

                res.json({
                    message: "Vote changed",
                    upvotes: answer.upvotes,
                    downvotes: answer.downvotes,
                    userVote: vote
                });
            }
        } else {
            // New vote
            if (vote === 1) {
                answer.upvotes += 1;
            } else {
                answer.downvotes += 1;
            }

            // Create new vote record
            await Vote.create({
                user: req.user.id,
                targetType: "answer",
                targetId: req.params.id,
                voteValue: vote
            });

            await answer.save();

            res.json({
                message: "Vote registered",
                upvotes: answer.upvotes,
                downvotes: answer.downvotes,
                userVote: vote
            });
        }
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate vote error (shouldn't happen with our logic, but just in case)
            return res.status(400).json({ message: "You have already voted on this answer" });
        }
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

exports.updateAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const answerId = req.params.id;

        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        // Check if user owns the answer
        if (answer.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own answers" });
        }

        // Filter content using AI service
        const contentFilter = await filterContent(content);
        if (!contentFilter.is_clean) {
            return res.status(400).json({
                message: "Answer contains inappropriate language or is too low effort"
            });
        }

        answer.content = contentFilter.filtered_content;
        await answer.save();

        res.json({
            message: "Answer updated successfully",
            answer: answer
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to update answer", error: err.message });
    }
};

exports.deleteAnswer = async (req, res) => {
    try {
        const answerId = req.params.id;

        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        // Check if user owns the answer
        if (answer.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own answers" });
        }

        // Remove answer from question's answers array
        const question = await Question.findById(answer.question);
        if (question) {
            question.answers = question.answers.filter(a => a.toString() !== answerId);
            await question.save();
        }

        await Answer.findByIdAndDelete(answerId);

        res.json({ message: "Answer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete answer", error: err.message });
    }
};
