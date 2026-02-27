const express = require("express");
const router = express.Router();

const { verifyToken, hasRole } = require("../middlewares/auth.middleware");
const { dashboardAdmin } = require("../controllers/dashboard.controller");

// Solo ADMIN (rol 1)
router.get("/admin", verifyToken, hasRole(1), dashboardAdmin);

module.exports = router;