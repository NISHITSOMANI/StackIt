const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["answer"],
        default: "answer"
    },
    message: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true, 
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
