const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const feedbackController = require("../controllers/feedbackController");

router.post("/feedback", auth, feedbackController.submitFeedback);

module.exports = router;
