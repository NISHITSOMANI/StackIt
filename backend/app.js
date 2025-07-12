const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth Route
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes); 

// Question Route
const questionRoutes = require("./routes/questionRoutes");
app.use("/questions", questionRoutes);

// Answer Route
const answerRoutes = require("./routes/answerRoutes");
app.use("/", answerRoutes); 

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

// Admin Route
app.use("/", require("./routes/adminRoutes"));

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
