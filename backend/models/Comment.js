const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
