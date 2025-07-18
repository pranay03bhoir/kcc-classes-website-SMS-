const express = require("express");
const {
  userAuthCheck,
  getAllCourses,
  getAllToppers,
} = require("../controllers/common.user.controller");
const router = express.Router();

router.get("/auth/check", userAuthCheck);
router.get("/get/courses", getAllCourses);
router.get("/get/toppers", getAllToppers);
module.exports = router;
