const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
    getUserById,
    updateUser
} = require("../controllers/userController");

// GET /users/:id
router.get("/users/:id", getUserById);

// PUT /users/:id
router.put("/users/:id", auth, updateUser);

module.exports = router; 