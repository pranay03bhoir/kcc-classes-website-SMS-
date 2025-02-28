const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      res.status(400).json({
        success: false,
        message: `User ${existingAdmin.name} already exists, Kindly login`,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const admin = Admin({
        name,
        email,
        password: hashedPassword,
      });
      await admin.save();
      res.status(200).json({
        success: true,
        message: "Registered successfully",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Admin.findOne({ email: email });
    if (!existingUser) {
      res.status(400).json({
        success: false,
        message: `User is not registered, Please register first`,
      })
    }else {
      const adminUser = await bcrypt.compare(password, existingUser.password);
      if (adminUser) {
        const payload = {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        }
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET,{
          expiresIn: "1h"
        })
        res.status(200).json({
          success: true,
          message: "Login successfully",
          accessToken: accessToken,
        })
      }else {
        res.status(401).json({
          success: false,
          message: "Login failed",
        })
      }
    }

  }catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    if (!students) {
      res.status(404).json({
        success: false,
        message: "No students found",
      })
    }else {
      res.status(200).json({
        success: true,
        message: "Students found",
        students: students,
      })
    }
  }catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}
module.exports = {adminRegister,adminLogin,getAllStudents}