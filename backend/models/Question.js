const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String, // Rich text (HTML/markdown)
            required: true,
        },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        answers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Answer",
            },
        ],
        acceptedAnswer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer",
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
