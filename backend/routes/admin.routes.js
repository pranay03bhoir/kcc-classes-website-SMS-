const express = require("express");
const {
  adminRegister,
  adminLogin,
  adminLogout,
  getAllStudents,
  getAllTeachers,
  getStudentsById,
  getTeachersById,
  updateTeachersDetails,
  updateStudentsDetails,
  deleteStudent,
  deleteTeacher,
  createSubject,
  updateSubject,
  getAllSubjects,
  deleteSubject,
  enrollStudentInSubject,
  removeStudentFromSubject,
  getStudentsBySubject,
  addTeacherToSubject,
  removeTeacherFromSubject,
  markStudentAttendance,
  getAttendanceRecords,
  getStudentByAttendance,
  getAttendanceByDate,
  addGradesToStudent,
  updateStudentScore,
  getStudentScore,
  getScoresForSubject,
  createBatch,
  addStudentToBatch,
  addTeacherToBatch,
  removeStudentFromBatch,
  removeTeacherFromBatch,
} = require("../controllers/admin.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");
const loginAuth = require("../middlewares/loginAuth.middleware");
const {
  generateNewAccessRefreshToken,
} = require("../controllers/teacher.controller");
const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/refresh", generateNewAccessRefreshToken);
router.post("/logout", adminLogout);
router.get("/students", getAllStudents);
router.get(
  "/students/subjects/:id",
  loginAuth,
  adminAuth,
  getStudentsBySubject,
);
router.get("/teachers", getAllTeachers);
router.get("/students/:studentId", loginAuth, adminAuth, getStudentsById);
router.get("/teachers/:id", loginAuth, adminAuth, getTeachersById);
router.put("/teachers/update/:id", loginAuth, adminAuth, updateTeachersDetails);
router.put("/students/:id", loginAuth, adminAuth, updateStudentsDetails);
router.delete("/teachers/:id", loginAuth, adminAuth, deleteTeacher);
router.delete("/students/:id", loginAuth, adminAuth, deleteStudent);
router.post("/subjects", createSubject);
router.put("/subjects/:id", updateSubject);
router.get("/subjects", getAllSubjects);
router.delete("/subjects/:id", deleteSubject);
router.put(
  "/subjects/add/students/:studentId",
  loginAuth,
  adminAuth,
  enrollStudentInSubject,
);
router.put(
  "/subjects/add/teachers/:teacherId",
  loginAuth,
  adminAuth,
  addTeacherToSubject,
);
router.put(
  "/subjects/students/:id",
  loginAuth,
  adminAuth,
  removeStudentFromSubject,
);
router.put(
  "/subjects/teachers/:id",
  loginAuth,
  adminAuth,
  removeTeacherFromSubject,
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
  "/scores/students/:studentId/:subjectId/:examType",
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
  "/scores/subjects/:subjectId",
  loginAuth,
  adminAuth,
  getScoresForSubject,
);
router.post("/batch", createBatch);
router.post("/add/student/batch/:id", addStudentToBatch);
router.post("/add/teacher/batch/:id", addTeacherToBatch);
router.delete("/remove/student/batch/:id", removeStudentFromBatch);
router.delete("/remove/teacher/batch/:id", removeTeacherFromBatch);
module.exports = router;
