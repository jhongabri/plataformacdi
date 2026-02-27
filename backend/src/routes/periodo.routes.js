const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  crear
} = require("../controllers/periodo.controller");

router.post("/", verifyToken, crear);

module.exports = router;