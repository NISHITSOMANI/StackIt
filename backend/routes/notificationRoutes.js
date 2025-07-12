const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");

router.get("/notifications", authMiddleware, getNotifications);
router.post("/notifications/read/:id", authMiddleware, markAsRead);

module.exports = router;
