const express = require("express");
const {
  userAuthCheck,
  getAllCourses,
  getAllToppers,
  getPublicFaculty,
  getPublicTestimonials,
  submitRegistrationLead,
  submitContactInquiry,
} = require("../controllers/common.user.controller");
const router = express.Router();

router.get("/auth/check", userAuthCheck);
router.get("/get/courses", getAllCourses);
router.get("/get/toppers", getAllToppers);
router.get("/get/faculty", getPublicFaculty);
router.get("/get/testimonials", getPublicTestimonials);
router.post("/registration", submitRegistrationLead);
router.post("/contact", submitContactInquiry);
module.exports = router;
