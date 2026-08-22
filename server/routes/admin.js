const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// Apply auth and admin middleware to all routes
router.use(auth, checkAdmin);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);

module.exports = router;
