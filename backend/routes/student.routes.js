const express = require("express");
const {
  studentRegister,
  studentLogin,
  updateStudentProfile,
  studentLogout,
} = require("../controllers/student.controller");
const loginAuth = require("../middlewares/loginAuth.middleware.js");
const router = express.Router();

router.post("/register", studentRegister);
router.post("/login", studentLogin);
router.post("/logout", studentLogout);
router.put("/update", loginAuth, updateStudentProfile);
module.exports = router;
