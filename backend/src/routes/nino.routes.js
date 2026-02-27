const express = require("express");
const router = express.Router();
const { verifyToken, hasRole } = require("../middlewares/auth.middleware");
const {
  crearNino,
  obtenerNinos
} = require("../controllers/nino.controller");

router.post("/", verifyToken, hasRole(1,2), crearNino);
router.get("/", verifyToken, obtenerNinos);

module.exports = router;