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

// Approve a pending admin
exports.approveAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin || admin.role !== "Admin") {
            return res.status(404).json({ message: "Admin not found" });
        }

        admin.adminStatus = "approved";
        await admin.save();

        res.json({ message: "Admin approved successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to approve admin", error: err.message });
    }
};

// Decline a pending admin
exports.declineAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin || admin.role !== "Admin") {
            return res.status(404).json({ message: "Admin not found" });
        }

        admin.adminStatus = "declined";
        await admin.save();

        res.json({ message: "Admin declined successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to decline admin", error: err.message });
    }
};

// Get list of pending admins (optional, for admin panel UI)
exports.getPendingAdmins = async (req, res) => {
    try {
        const pendingAdmins = await User.find({ role: "Admin", adminStatus: "pending" }).select("-password");
        res.json(pendingAdmins);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch pending admins", error: err.message });
    }
};