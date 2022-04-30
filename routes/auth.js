const express = require("express");
const { protect } = require("../middleware/auth");
const { register, login, getMe, logout } = require("../controller/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logout);

module.exports = router;
