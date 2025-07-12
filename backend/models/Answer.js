const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        content: {
            type: String, // Rich text
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
        // Virtual for total score
        score: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Add indexes for better performance
answerSchema.index({ question: 1, createdAt: -1 });
answerSchema.index({ user: 1 });

// Virtual for calculating score
answerSchema.virtual('totalScore').get(function () {
    return this.upvotes - this.downvotes;
});

// Pre-save middleware to update score
answerSchema.pre('save', function (next) {
    this.score = this.upvotes - this.downvotes;
    next();
});

module.exports = mongoose.model("Answer", answerSchema);
