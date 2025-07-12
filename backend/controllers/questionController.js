const Question = require("../models/Question");
const Tag = require("../models/Tag");
const logActivity = require("../services/activityLogger");
const { predictTags, filterContent } = require("../services/aiService");

exports.createQuestion = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        // Filter content using AI service
        const contentFilter = await filterContent(description);
        if (!contentFilter.is_clean) {
            return res.status(400).json({
                message: "Content contains inappropriate language or is too low effort"
            });
        }

        // Get AI predicted tags if not provided
        let finalTags = tags || [];
        if (!tags || tags.length === 0) {
            const predictedTags = await predictTags(title, contentFilter.filtered_content);
            finalTags = predictedTags.slice(0, 5);
        }

        // Clean and normalize tag names
        const tagDocs = await Promise.all(
            [...new Set(finalTags.map(t => t.trim().toLowerCase()))].slice(0, 5).map(async (tagName) => {
                let tag = await Tag.findOne({ name: tagName });
                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }
                return tag;
            })
        );

        const question = await Question.create({
            title,
            description: contentFilter.filtered_content,
            user: req.user.id,
            tags: tagDocs.map(tag => tag._id)
        });

        await logActivity({
            userId: req.user.id,
            action: "Posted a question",
            details: `Question: ${title}`,
        });

        res.status(201).json({
            message: "Question posted successfully",
            questionId: question._id,
            predicted_tags: finalTags
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to post question", error: err.message });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const { tags, page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        let query = {};

        if (tags) {
            const tagNames = tags.split(",").map(tag => tag.trim().toLowerCase());
            console.log('Searching for tags:', tagNames);

            // Find corresponding tag ObjectIds
            const tagDocs = await Tag.find({ name: { $in: tagNames } });
            console.log('Found tag documents:', tagDocs.map(t => t.name));

            const tagIds = tagDocs.map(tag => tag._id);
            if (tagIds.length) {
                query.tags = { $all: tagIds };
                console.log('Query with tag IDs:', query);
            } else {
                console.log('No matching tags found, returning empty result');
            }
        }

        const [questions, total] = await Promise.all([
            Question.find(query)
                .populate("user", "username")
                .populate("tags", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Question.countDocuments(query)
        ]);

        res.json({
            questions,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalQuestions: total,
                hasNext: pageNum * limitNum < total,
                hasPrev: pageNum > 1
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch questions", error: err.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate("user", "username")
            .populate("tags", "name")
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

exports.voteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found" });

        const { vote } = req.body;

        if (vote === 1) {
            question.upvotes += 1;
        } else if (vote === -1) {
            question.downvotes += 1;
        } else {
            return res.status(400).json({ message: "Invalid vote value. Use 1 or -1." });
        }

        await question.save();

        res.json({
            message: "Vote registered",
            upvotes: question.upvotes,
            downvotes: question.downvotes,
        });
    } catch (err) {
        res.status(500).json({ message: "Vote failed", error: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const questionId = req.params.id;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Check if user owns the question
        if (question.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own questions" });
        }

        // Filter content using AI service
        const contentFilter = await filterContent(description);
        if (!contentFilter.is_clean) {
            return res.status(400).json({
                message: "Content contains inappropriate language or is too low effort"
            });
        }

        // Update tags if provided
        let finalTags = tags || question.tags;
        if (tags && tags.length > 0) {
            const tagDocs = await Promise.all(
                [...new Set(tags.map(t => t.trim().toLowerCase()))].slice(0, 5).map(async (tagName) => {
                    let tag = await Tag.findOne({ name: tagName });
                    if (!tag) {
                        tag = await Tag.create({ name: tagName });
                    }
                    return tag;
                })
            );
            finalTags = tagDocs.map(tag => tag._id);
        }

        // Update question
        question.title = title || question.title;
        question.description = contentFilter.filtered_content;
        question.tags = finalTags;

        await question.save();

        await logActivity({
            userId: req.user.id,
            action: "Updated a question",
            details: `Question: ${question.title}`,
        });

        res.json({
            message: "Question updated successfully",
            question: question
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to update question", error: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Check if user owns the question
        if (question.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own questions" });
        }

        await Question.findByIdAndDelete(questionId);

        await logActivity({
            userId: req.user.id,
            action: "Deleted a question",
            details: `Question: ${question.title}`,
        });

        res.json({ message: "Question deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete question", error: err.message });
    }
};
