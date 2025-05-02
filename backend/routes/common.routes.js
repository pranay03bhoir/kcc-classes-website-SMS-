const express = require("express");
const {
  userAuthCheck,
  getAllCourses,
} = require("../controllers/common.user.controller");
const router = express.Router();

router.get("/auth/check", userAuthCheck);
router.get("/get/courses", getAllCourses);
module.exports = router;
