const express = require("express");
const {
  studentRegister,
  studentLogin,
  updateStudentProfile,
  studentLogout,
  getStudentCourses,
  generateNewRefreshAccessToken,
} = require("../controllers/student.controller");
const loginAuth = require("../middlewares/loginAuth.middleware.js");
const router = express.Router();

router.post("/register", studentRegister);
router.post("/login", studentLogin);
router.post("/refresh", generateNewRefreshAccessToken);
router.post("/logout", studentLogout);
router.put("/update", loginAuth, updateStudentProfile);
router.get("/get/courses", loginAuth, getStudentCourses);
module.exports = router;
