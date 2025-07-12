const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// POST /auth/register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully",
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.banned) {
            return res.status(403).json({ message: "User is banned" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

module.exports = router;
