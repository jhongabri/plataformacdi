const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  crear
} = require("../controllers/grupo.controller");

router.post("/", verifyToken, crear);

module.exports = router;