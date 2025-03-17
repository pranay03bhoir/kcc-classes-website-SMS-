const express = require("express");
const {
  teacherRegister,
  teacherLogin,
  teacherLogout,
  getAllStudents,
  getStudentById,
  addStudentAttendance,
  updateStudentAttendance,
  getAllAttendance,
  getAttendanceForStudent,
  addStudentScores,
  updateStudentScores,
  generateNewAccessRefreshToken,
} = require("../controllers/teacher.controller");
const loginAuth = require("../middlewares/loginAuth.middleware");
const teacherAuth = require("../middlewares/teacherAuth.middleware");
const router = express.Router();

router.post("/register", teacherRegister);
router.post("/login", teacherLogin);
router.post("/refresh", generateNewAccessRefreshToken);
router.post("/logout", teacherLogout);
router.get("/students", loginAuth, teacherAuth, getAllStudents);
router.get("/students/:studentId", loginAuth, teacherAuth, getStudentById);
router.post(
  "/students/attendance",
  loginAuth,
  teacherAuth,
  addStudentAttendance,
);
router.put(
  "/students/:studentId/attendance/:attendanceId",
  loginAuth,
  teacherAuth,
  updateStudentAttendance,
);
router.get(
  "/students/all/attendance",
  loginAuth,
  teacherAuth,
  getAllAttendance,
);
router.get("/students/:studentId/attendance", getAttendanceForStudent);
router.post("/students/scores", addStudentScores);
router.put("/students/update/scores/:scoreId", updateStudentScores);
module.exports = router;
