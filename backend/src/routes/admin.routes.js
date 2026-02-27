const express = require("express");
const router = express.Router();

const { getAdminStats, createDocente } = require("../controllers/admin.controller");

// 👇 Importación correcta
const { verifyToken, hasRole } = require("../middlewares/auth.middleware");

// Solo admin puede ver stats
router.get("/stats", verifyToken, hasRole(1), getAdminStats);

// Solo admin puede crear docentes
router.post("/docentes", verifyToken, hasRole(1), createDocente);

module.exports = router;
