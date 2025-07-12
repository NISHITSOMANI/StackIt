const validateQuestion = (req, res, next) => {
    const { title, description } = req.body;

    if (!title || title.trim().length < 10) {
        return res.status(400).json({
            message: "Title must be at least 10 characters long"
        });
    }

    if (!description || description.trim().length < 20) {
        return res.status(400).json({
            message: "Description must be at least 20 characters long"
        });
    }

    next();
};

const validateAnswer = (req, res, next) => {
    const { description } = req.body;

    if (!description || description.trim().length < 10) {
        return res.status(400).json({
            message: "Answer must be at least 10 characters long"
        });
    }

    next();
};

const validateUser = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || username.trim().length < 3) {
        return res.status(400).json({
            message: "Username must be at least 3 characters long"
        });
    }

    if (!email || !email.includes('@')) {
        return res.status(400).json({
            message: "Valid email is required"
        });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        });
    }

    next();
};

const validateVote = (req, res, next) => {
    const { vote } = req.body;

    if (vote !== 1 && vote !== -1) {
        return res.status(400).json({
            message: "Vote must be 1 (upvote) or -1 (downvote)"
        });
    }

    next();
};

module.exports = {
    validateQuestion,
    validateAnswer,
    validateUser,
    validateVote
}; 