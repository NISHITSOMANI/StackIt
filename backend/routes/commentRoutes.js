const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const commentController = require("../controllers/commentController");

// POST /answers/:id/comments
router.post("/answers/:id/comments", auth, commentController.addComment);

// GET /answers/:id/comments
router.get("/answers/:id/comments", commentController.getComments);

module.exports = router;
