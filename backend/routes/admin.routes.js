const express = require("express");
const {
  adminRegister,
  adminLogin,
  getAllStudents,
  getAllTeachers,
  getStudentsById,
  getTeachersById,
  updateTeachersDetails,
  updateStudentsDetails,
  deleteStudent,
  deleteTeacher,
  createCourse,
  updateCourse,
  getAllCourses,
  deleteCourse,
  enrollStudentInCourse,
  removeStudentFromCourse,
  getStudentsByCourse,
  addTeacherToCourse,
  removeTeacherFromCourse,
  markStudentAttendance,
  getAttendanceRecords,
  getStudentByAttendance,
  getAttendanceByDate,
  addGradesToStudent,
  updateStudentScore,
  getStudentScore,
  getScoresForCourse,
} = require("../controllers/admin.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");
const loginAuth = require("../middlewares/loginAuth.middleware");
const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/students", loginAuth, adminAuth, getAllStudents);
router.get("/students/courses/:id", loginAuth, adminAuth, getStudentsByCourse);
router.get("/teachers", loginAuth, adminAuth, getAllTeachers);
router.get("/students/:id", loginAuth, adminAuth, getStudentsById);
router.get("/teachers/:id", loginAuth, adminAuth, getTeachersById);
router.put("/teachers/update/:id", loginAuth, adminAuth, updateTeachersDetails);
router.put("/students/:id", loginAuth, adminAuth, updateStudentsDetails);
router.delete("/teachers/:id", loginAuth, adminAuth, deleteTeacher);
router.delete("/students/:id", loginAuth, adminAuth, deleteStudent);
router.post("/courses", loginAuth, adminAuth, createCourse);
router.put("/courses/:id", loginAuth, adminAuth, updateCourse);
router.get("/courses", loginAuth, adminAuth, getAllCourses);
router.delete("/courses/:id", loginAuth, adminAuth, deleteCourse);
router.put(
  "/courses/add/students/:studentId",
  loginAuth,
  adminAuth,
  enrollStudentInCourse,
);
router.put(
  "/courses/add/teachers/:teacherId",
  loginAuth,
  adminAuth,
  addTeacherToCourse,
);
router.put(
  "/courses/students/:id",
  loginAuth,
  adminAuth,
  removeStudentFromCourse,
);
router.put(
  "/courses/teachers/:id",
  loginAuth,
  adminAuth,
  removeTeacherFromCourse,
);
router.post(
  "/students/attendance",
  loginAuth,
  adminAuth,
  markStudentAttendance,
);
router.get("/all/attendance", loginAuth, adminAuth, getAttendanceRecords);
router.get(
  "/attendance/students/:id",
  loginAuth,
  adminAuth,
  getStudentByAttendance,
);
router.get("/attendance/date", loginAuth, adminAuth, getAttendanceByDate);
router.post("/scores/students", loginAuth, adminAuth, addGradesToStudent);
router.put(
  "/scores/students/:studentId/:courseId/:examType",
  loginAuth,
  adminAuth,
  updateStudentScore,
);
router.get(
  "/scores/students/:studentId",
  loginAuth,
  adminAuth,
  getStudentScore,
);
router.get(
  "/scores/courses/:courseId",
  loginAuth,
  adminAuth,
  getScoresForCourse,
);
module.exports = router;
