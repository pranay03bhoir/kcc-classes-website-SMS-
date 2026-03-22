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
  studentAuthCheck,
  getStudentScores,
  getStudentAttendance,
  upsertStudentTestimonial,
  getMyTestimonial,
} = require("../controllers/student.controller");
const loginAuth = require("../middlewares/loginAuth.middleware.js");
const router = express.Router();

router.post("/register", studentRegister);
router.get("/verify-email", studentVerifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/login/student", studentLogin);
router.get("/auth/check/student", studentAuthCheck);
router.post("/refresh", generateNewRefreshAccessToken);
router.post("/logout", studentLogout);
router.get("/get/student/details", loginAuth, getStudentDetails);
router.put("/update", loginAuth, updateStudentProfile);
router.get("/get/Subjects", loginAuth, getStudentSubjects);
router.get("/get/student/scores", loginAuth, getStudentScores);
router.get("/get/student/attendance", loginAuth, getStudentAttendance);
router.post("/testimonial", loginAuth, upsertStudentTestimonial);
router.get("/testimonial/me", loginAuth, getMyTestimonial);
module.exports = router;
