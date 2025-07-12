const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

router.get("/admin/pending-admins", requireAuth, requireAdmin, adminController.getPendingAdmins);
router.put("/admin/approve/:id", requireAuth, requireAdmin, adminController.approveAdmin);
router.put("/admin/decline/:id", requireAuth, requireAdmin, adminController.declineAdmin);

module.exports = router;
