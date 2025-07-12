const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// User or admin registration (admins require elevated rights)
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Prevent anyone from directly registering as admin unless an admin is making the request
        if (role === "Admin") {
            if (!req.user || req.user.role !== "Admin") {
                return res.status(403).json({ message: "Only admins can create other admins" });
            }
        }

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || "User"  // default role
        });

        const token = generateToken(user);

        res.status(201).json({
            message: `${user.role} registered successfully`,
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

// Login for both admin & user
exports.loginUser = async (req, res) => {
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
            message: `${user.role} login successful`,
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

// Authenticated user info
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user", error: err.message });
    }
};
