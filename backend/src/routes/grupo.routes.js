const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  crear,
  listar,
  getById
} = require("../controllers/grupo.controller");

router.get("/", verifyToken, listar);
router.get("/:id", verifyToken, getById);
router.post("/", verifyToken, crear);

module.exports = router;