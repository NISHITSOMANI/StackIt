const mongoose = require("mongoose");

const adminMessageSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        readAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model("AdminMessage", adminMessageSchema); 