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
  countAllStudents,
  countAllTeachers,
  countAllSubjects,
  getAllBatches,
  createStudents,
  updateStudentDetails,
  searchAStudent,
  searchATeacher,
  updateBatch,
  getAdminDetails,
  updateAdminDetails,
  getAllStudentsWithPagination,
  updateStudentAttendance,
  deleteStudentScore,
  generateNewRefreshAccessToken,
  getFilteredStudents,
  getAttendanceStats,
  getFilteredAttendanceRecords,
} = require("../controllers/admin.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");
const loginAuth = require("../middlewares/loginAuth.middleware");
const router = express.Router();

router.post("/register", adminRegister);
router.post("/login/admin", adminLogin);
router.post("/refresh", generateNewRefreshAccessToken);
router.post("/logout", adminLogout);
router.get("/get/admin/details", loginAuth, adminAuth, getAdminDetails);
router.put("/update/admin/details", loginAuth, adminAuth, updateAdminDetails);
router.post("/create/students", loginAuth, adminAuth, createStudents);
router.put("/update/students/:id", loginAuth, adminAuth, updateStudentDetails);
router.get("/students", loginAuth, adminAuth, getAllStudents);
router.get("/all/students", loginAuth, adminAuth, getAllStudentsWithPagination);
router.get("/search/students", loginAuth, adminAuth, searchAStudent);
router.get("/search/teachers", loginAuth, adminAuth, searchATeacher);
router.get(
  "/students/subjects/:id",
  loginAuth,
  adminAuth,
  getStudentsBySubject
);
router.get("/teachers", loginAuth, adminAuth, getAllTeachers);
router.get("/students/:studentId", loginAuth, adminAuth, getStudentsById);
router.get("/teachers/:id", loginAuth, adminAuth, getTeachersById);
router.put("/teachers/update/:id", loginAuth, adminAuth, updateTeachersDetails);
router.delete("delete/teachers/:id", loginAuth, adminAuth, deleteTeacher);
router.delete("/delete/students/:id", loginAuth, adminAuth, deleteStudent);
router.get("/students-count", loginAuth, adminAuth, countAllStudents);
router.get("/teachers-count", loginAuth, adminAuth, countAllTeachers);
router.post("/subjects", loginAuth, adminAuth, createSubject);
router.put("/subjects/:id", loginAuth, adminAuth, updateSubject);
router.get("/subjects", loginAuth, adminAuth, getAllSubjects);
router.get("/subjects-count", loginAuth, adminAuth, countAllSubjects);
router.delete("/subjects/:id", loginAuth, adminAuth, deleteSubject);
router.put(
  "/subjects/add/students/:studentId",
  loginAuth,
  adminAuth,
  enrollStudentInSubject
);
router.put(
  "/subjects/add/teachers/:teacherId",
  loginAuth,
  adminAuth,
  addTeacherToSubject
);
router.put(
  "/subjects/remove/students/:id",
  loginAuth,
  adminAuth,
  removeStudentFromSubject
);
router.put(
  "/subjects/teachers/:id",
  loginAuth,
  adminAuth,
  removeTeacherFromSubject
);
router.post(
  "/students/attendance",
  loginAuth,
  adminAuth,
  markStudentAttendance
);
router.put(
  "/students/:studentId/attendance/:attendanceId",
  loginAuth,
  adminAuth,
  updateStudentAttendance
);
router.get("/all/attendance", loginAuth, adminAuth, getAttendanceRecords);
router.get(
  "/attendance/students/:id",
  loginAuth,
  adminAuth,
  getStudentByAttendance
);
router.get("/attendance/date", loginAuth, adminAuth, getAttendanceByDate);
router.post("/scores/students", loginAuth, adminAuth, addGradesToStudent);
router.put(
  "/scores/students/:studentId/:subjectId/:examType",
  loginAuth,
  adminAuth,
  updateStudentScore
);
router.delete(
  "/scores/students/:studentId/:subjectId/:examType",
  loginAuth,
  adminAuth,
  deleteStudentScore
);
router.get(
  "/scores/students/:studentId",
  loginAuth,
  adminAuth,
  getStudentScore
);
router.get(
  "/scores/subjects/:subjectId",
  loginAuth,
  adminAuth,
  getScoresForSubject
);
router.post("/batch/create", loginAuth, adminAuth, createBatch);
router.put("/batch/update/:id", loginAuth, adminAuth, updateBatch);
router.get("/batches", loginAuth, adminAuth, getAllBatches);
router.put("/add/student/batch/:id", loginAuth, adminAuth, addStudentToBatch);
router.put("/add/teacher/batch/:id", loginAuth, adminAuth, addTeacherToBatch);
router.delete(
  "/remove/student/batch/:id",
  loginAuth,
  adminAuth,
  removeStudentFromBatch
);
router.delete(
  "/remove/teacher/batch/:id",
  loginAuth,
  adminAuth,
  removeTeacherFromBatch
);
router.get("/filtered/students", loginAuth, adminAuth, getFilteredStudents);
router.get("/attendance/stats", loginAuth, adminAuth, getAttendanceStats);
router.get(
  "/filtered/attendance",
  loginAuth,
  adminAuth,
  getFilteredAttendanceRecords
);
module.exports = router;
