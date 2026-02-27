const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

router.get("/perfil", verifyToken, (req, res) => {
  res.json({
    message: "Ruta protegida funcionando 🔐",
    user: req.user
  });
});

router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({
    message: "Bienvenido administrador 👑"
  });
});

module.exports = router;