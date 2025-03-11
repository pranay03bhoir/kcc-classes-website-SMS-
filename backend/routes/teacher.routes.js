const express = require("express");
const {
  teacherRegister,
  teacherLogin,
  teacherLogout,
  getAllStudents,
  getStudentById,
  addStudentAttendance,
  updateStudentAttendance,
} = require("../controllers/teacher.controller");
const loginAuth = require("../middlewares/loginAuth.middleware");
const teacherAuth = require("../middlewares/teacherAuth.middleware");
const router = express.Router();

router.post("/register", teacherRegister);
router.post("/login", teacherLogin);
router.post("/logout", teacherLogout);
router.get("/students", loginAuth, teacherAuth, getAllStudents);
router.get("/students/:studentId", loginAuth, teacherAuth, getStudentById);
router.post(
  "/students/attendance",
  loginAuth,
  teacherAuth,
  addStudentAttendance
);
router.put(
  "/students/:studentId/attendance/:attendanceId",
  loginAuth,
  teacherAuth,
  updateStudentAttendance
);

module.exports = router;
