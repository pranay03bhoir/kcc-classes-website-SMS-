const express = require("express");
const {
  studentRegister,
  studentLogin,
} = require("../controllers/student.controller");
const router = express.Router();

router.post("/register", studentRegister);
router.post("/login", studentLogin);
module.exports = router;
