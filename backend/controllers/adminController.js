const Message = require("../models/AdminMessage");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const ActivityLog = require("../models/ActivityLog");

exports.broadcastMessage = async (req, res) => {
    try {
        const { subject, body } = req.body;

        const msg = await Message.create({ subject, body });
        // You can also push this to notifications if needed

        res.status(201).json({ message: "Message broadcasted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to send message", error: err.message });
    }
};

exports.getReports = async (req, res) => {
    try {
        const activityLogs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
        const feedbackStats = await Feedback.find().sort({ createdAt: -1 }).limit(100);

        res.json({
            activityLogs,
            feedbackStats,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reports", error: err.message });
    }
};
