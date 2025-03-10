const express = require("express");
const {
  teacherRegister,
  teacherLogin,
  teacherLogout,
  getAllStudents,
  getStudentById,
  addStudentAttendance,
} = require("../controllers/teacher.controller");
const router = express.Router();

router.post("/register", teacherRegister);
router.post("/login", teacherLogin);
router.post("/logout", teacherLogout);
router.get("/students", getAllStudents);
router.get("/students/:studentId", getStudentById);
router.post("/students/attendance", addStudentAttendance);

module.exports = router;
