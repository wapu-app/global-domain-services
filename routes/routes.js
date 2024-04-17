const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController.js");

// Application Routes
router.post("/user", appController.user);
router.post("/search", appController.search);

module.exports = router;
