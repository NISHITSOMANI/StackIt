const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 });

        const formatted = notifications.map(n => ({
            id: n._id,
            message: n.message,
            read: n.read,
            createdAt: n.createdAt
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update notification", error: err.message });
    }
};
