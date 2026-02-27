const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  registrar
} = require("../controllers/asistencia.controller");

router.post("/", verifyToken, registrar);

module.exports = router;