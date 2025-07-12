const express = require("express");
const router = express.Router();
const { getAllTags } = require("../controllers/tagController");

router.get("/tags", getAllTags);

module.exports = router;
