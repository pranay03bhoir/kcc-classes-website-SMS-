const express = require("express");
const {
  teacherRegister,
  teacherLogin,
} = require("../controllers/teacher.controller");
const router = express.Router();

router.post("/register", teacherRegister);
router.post("/login", teacherLogin);

module.exports = router;
