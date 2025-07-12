const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

router.get("/admin/pending-admins", authMiddleware, requireAdmin, adminController.getPendingAdmins);
router.put("/admin/approve/:id", authMiddleware, requireAdmin, adminController.approveAdmin);
router.put("/admin/decline/:id", authMiddleware, requireAdmin, adminController.declineAdmin);
router.post("/admin/message", authMiddleware, requireAdmin, adminController.broadcastMessage);
router.get("/admin/reports", authMiddleware, requireAdmin, adminController.getReports);

module.exports = router;
