const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");
const { validateUser } = require("../middlewares/validationMiddleware");

// POST /auth/register
router.post("/register", validateUser, registerUser);

// POST /auth/login
router.post("/login", loginUser);

// GET /auth/me
router.get("/me", auth, getCurrentUser);

module.exports = router;
