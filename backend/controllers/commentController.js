const Comment = require("../models/Comment");
const Answer = require("../models/Answer");
const Notification = require("../models/Notification");
const User = require("../models/User");
const extractMentions = require("../utils/extractMentions");

exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const answerId = req.params.id;

        const answer = await Answer.findById(answerId);
        if (!answer) return res.status(404).json({ message: "Answer not found" });

        const comment = await Comment.create({
            content,
            user: req.user.id,
            answer: answerId,
        });

        // Notify answer owner (if not self)
        if (answer.user.toString() !== req.user.id) {
            const commenter = await User.findById(req.user.id).select("username");
            await Notification.create({
                recipient: answer.user,
                type: "comment",
                message: `${commenter.username} commented on your answer`,
                link: `/questions/${answer.question}`,
            });
        }

        // Notify mentioned users
        const mentionedUsernames = extractMentions(content);
        const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });

        for (const user of mentionedUsers) {
            if (user._id.toString() !== req.user.id) {
                await Notification.create({
                    recipient: user._id,
                    type: "mention",
                    message: `${req.user.username} mentioned you in a comment`,
                    link: `/questions/${answer.question}`,
                });
            }
        }

        res.status(201).json({
            message: "Comment added",
            commentId: comment._id,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to add comment", error: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const answerId = req.params.id;

        const comments = await Comment.find({ answer: answerId })
            .populate("user", "username")
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch comments", error: err.message });
    }
};