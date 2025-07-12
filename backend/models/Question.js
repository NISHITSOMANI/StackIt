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
questionSchema.index({ user: 1, createdAt: -1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ title: 'text', description: 'text' });

// Virtual for calculating score
questionSchema.virtual('totalScore').get(function () {
    return this.upvotes - this.downvotes;
});

// Pre-save middleware to update score
questionSchema.pre('save', function (next) {
    this.score = this.upvotes - this.downvotes;
    next();
});

module.exports = mongoose.model("Question", questionSchema);
