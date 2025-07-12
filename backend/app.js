const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// AI Service health check
const { healthCheck } = require("./services/aiService");

// Rate limiting
const { generalLimiter } = require("./middlewares/rateLimitMiddleware");

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.CORS_ORIGIN || 'https://yourdomain.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Apply general rate limiting
app.use(generalLimiter);

// Auth Route
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Question Route
const questionRoutes = require("./routes/questionRoutes");
app.use("/questions", questionRoutes);

// Answer Route
const answerRoutes = require("./routes/answerRoutes");
app.use("/answers", answerRoutes);

// Tag Route
const tagRoutes = require("./routes/tagRoutes");
app.use("/", tagRoutes);

// Notification Route
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/", notificationRoutes);

// Comment Route
const commentRoutes = require("./routes/commentRoutes");
app.use("/", commentRoutes);

// Feedback Route
app.use("/", require("./routes/feedbackRoutes"));

// User Route
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

// Admin Route
app.use("/", require("./routes/adminRoutes"));

// AI Service Health Check Route
app.get("/ai-health", async (req, res) => {
    try {
        const isHealthy = await healthCheck();
        res.json({
            status: "success",
            ai_service: isHealthy ? "connected" : "disconnected",
            message: "StackIt API is running"
        });
    } catch (error) {
        res.json({
            status: "success",
            ai_service: "disconnected",
            message: "StackIt API is running (AI service unavailable)"
        });
    }
});

// Default Route
app.get("/", (req, res) => {
    res.send("StackIt API is running");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(process.env.PORT, () =>
            console.log(`Server running on port ${process.env.PORT}`)
        );
    })
    .catch((err) => console.error("MongoDB connection error:", err));
