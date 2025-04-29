const express = require("express");
const {
  studentRegister,
  studentVerifyEmail,
  resendVerificationEmail,
  studentLogin,
  updateStudentProfile,
  studentLogout,
  getStudentSubjects,
  generateNewRefreshAccessToken,
  getStudentDetails,
} = require("../controllers/student.controller");
const loginAuth = require("../middlewares/loginAuth.middleware.js");
const router = express.Router();

router.post("/register", studentRegister);
router.get("/verify-email", studentVerifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/login/student", studentLogin);
router.post("/refresh", generateNewRefreshAccessToken);
router.post("/logout", studentLogout);
router.get("/get/student/details", loginAuth, getStudentDetails);
router.put("/update", loginAuth, updateStudentProfile);
router.get("/get/Subjects", loginAuth, getStudentSubjects);
module.exports = router;
