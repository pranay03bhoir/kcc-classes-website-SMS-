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
} = require("../controllers/admin.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");
const loginAuth = require("../middlewares/loginAuth.middleware");
const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/students", loginAuth, adminAuth, getAllStudents);
router.get("/teachers", loginAuth, adminAuth, getAllTeachers);
router.get("/students/:id", loginAuth, adminAuth, getStudentsById);
router.get("/teachers/:id", loginAuth, adminAuth, getTeachersById);
router.put("/teachers/update/:id", loginAuth, adminAuth, updateTeachersDetails);
router.put("/students/:id", loginAuth, adminAuth, updateStudentsDetails);
router.delete("/teachers/:id", loginAuth, adminAuth, deleteTeacher);
router.delete("/students/:id", loginAuth, adminAuth, deleteStudent);

module.exports = router;
