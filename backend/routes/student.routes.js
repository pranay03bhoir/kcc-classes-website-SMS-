const express = require("express");
const {
  studentRegister,
  studentVerifyEmail,
  resendVerificationEmail,
  studentLogin,
  updateStudentProfile,
  studentLogout,
  getStudentCourses,
  generateNewRefreshAccessToken,
} = require("../controllers/student.controller");
const loginAuth = require("../middlewares/loginAuth.middleware.js");
const router = express.Router();

router.post("/register", studentRegister);
router.get("/verify-email", studentVerifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/login", studentLogin);
router.post("/refresh", generateNewRefreshAccessToken);
router.post("/logout", studentLogout);
router.put("/update", loginAuth, updateStudentProfile);
router.get("/get/courses", loginAuth, getStudentCourses);
module.exports = router;
