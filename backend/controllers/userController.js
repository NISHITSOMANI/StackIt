const User = require("../models/User");

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user", error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.params.id;

        // Only allow users to update their own profile
        if (userId !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own profile" });
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
}; 