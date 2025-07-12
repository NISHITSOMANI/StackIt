const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

// POST /auth/register
router.post("/register", registerUser);

// POST /auth/login
router.post("/login", loginUser);

// GET /auth/me
router.get("/me", auth, getCurrentUser);

module.exports = router;
