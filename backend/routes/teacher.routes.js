const express = require("express");
const {
  teacherRegister,
  teacherLogin,
  teacherVerifyEmail,
  teacherLogout,
  getAllStudents,
  getStudentById,
  updateStudentDetails,
  addStudentAttendance,
  updateStudentAttendance,
  getAllAttendance,
  getAttendanceForStudent,
  addStudentScores,
  updateStudentScores,
  generateNewAccessRefreshToken,
  getAllBatches,
  getTeacherDetails,
  updateTeacherDetails,
  resendVerificationEmailTeacher,
  getTeacherCourses,
} = require("../controllers/teacher.controller");
const loginAuth = require("../middlewares/loginAuth.middleware");
const teacherAuth = require("../middlewares/teacherAuth.middleware");
const router = express.Router();

router.post("/register", teacherRegister);
router.post("/login/teacher", teacherLogin);
router.get("/verify-email", teacherVerifyEmail);

router.post("/refresh", generateNewAccessRefreshToken);
router.post("/logout", teacherLogout);
router.get("/students", getAllStudents);
router.get("/students/:studentId", loginAuth, teacherAuth, getStudentById);
router.put("/update/student/:id", updateStudentDetails);
router.post("/students/attendance", addStudentAttendance);
router.put(
  "/students/:studentId/attendance/:attendanceId",
  loginAuth,
  teacherAuth,
  updateStudentAttendance
);
router.get(
  "/students/all/attendance",
  loginAuth,
  teacherAuth,
  getAllAttendance
);
router.get("/students/:studentId/attendance", getAttendanceForStudent);
router.post("/students/scores", addStudentScores);
router.put("/students/update/scores/:scoreId", updateStudentScores);
router.get("/get/batches", getAllBatches);
router.get("/get/teacher/details", loginAuth, teacherAuth, getTeacherDetails);
router.get("/get/teacher/courses", loginAuth, teacherAuth, getTeacherCourses);
router.put("/update/details/:id", loginAuth, teacherAuth, updateTeacherDetails);
router.post("/resend-verification-email", resendVerificationEmailTeacher);
module.exports = router;
