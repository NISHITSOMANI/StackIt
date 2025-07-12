const Question = require("../models/Question");

exports.createQuestion = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const question = await Question.create({
            title,
            description,
            tags,
            user: req.user.id,
        });
        res.status(201).json({ message: "Question posted", question });
    } catch (err) {
        res.status(500).json({ message: "Failed to post question", error: err.message });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate("user", "username")
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
        if (!question) return res.status(404).json({ message: "Question not found" });
        res.json(question);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch question", error: err.message });
    }
};
