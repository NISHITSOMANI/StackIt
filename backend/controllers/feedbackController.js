const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
    try {
        const { message, rating } = req.body;

        const feedback = await Feedback.create({
            user: req.user.id,
            message,
            rating,
        });

        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to submit feedback", error: err.message });
    }
};
