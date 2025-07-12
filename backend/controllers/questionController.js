const Question = require("../models/Question");
const Tag = require("../models/Tag");


exports.createQuestion = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        // Clean and normalize tag names
        const tagDocs = await Promise.all(
            [...new Set(tags.map(t => t.trim().toLowerCase()))].slice(0, 5).map(async (tagName) => {
                let tag = await Tag.findOne({ name: tagName });
                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }
                return tag;
            })
        );

        const question = await Question.create({
            title,
            description,
            user: req.user.id,
            tags: tagDocs.map(tag => tag._id)
        });

        res.status(201).json({
            message: "Question posted successfully",
            questionId: question._id
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to post question", error: err.message });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const { tags } = req.query;

        let query = {};

        if (tags) {
            const tagNames = tags.split(",").map(tag => tag.trim().toLowerCase());

            // Find corresponding tag ObjectIds
            const tagDocs = await Tag.find({ name: { $in: tagNames } });

            const tagIds = tagDocs.map(tag => tag._id);
            if (tagIds.length) {
                query.tags = { $in: tagIds };
            }
        }

        const questions = await Question.find(query)
            .populate("user", "username")
            .populate("tags", "name")
            .sort({ createdAt: -1 });

        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch questions", error: err.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate("user", "username")
            .populate({
                path: "answers",
                populate: { path: "user", select: "username" },
            });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json(question);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch question", error: err.message });
    }
};
