const express = require('express');
const {adminRegister,adminLogin,getAllStudents} = require("../controllers/admin.controller")
const adminAuth = require("../middlewares/adminAuth.middleware")
const loginAuth = require("../middlewares/loginAuth.middleware")
const router = express.Router();


router.post("/register",adminRegister)
router.post("/login",adminLogin)
router.get("/students",loginAuth,adminAuth,getAllStudents)

module.exports = router;