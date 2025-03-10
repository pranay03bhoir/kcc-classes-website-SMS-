const Teacher = require("../models/teacher.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const teacherRegister = async (req, res) => {
  try {
    const { name, email, password, contact, address } = req.body;
    const existingTeacher = await Teacher.findOne({ email: email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const teacher = new Teacher({
        name,
        email,
        password: hashedPassword,
        contact,
        address,
      });
      await teacher.save();
      if (teacher) {
        res.status(200).json({
          success: true,
          message: "Teacher registered successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error registering",
        });
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingTeacher = await Teacher.findOne({ email: email });
    if (!existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Please register first",
      });
    } else {
      const teacher = await bcrypt.compare(password, existingTeacher.password);
      if (teacher) {
        const payload = {
          id: existingTeacher._id,
          email: existingTeacher.email,
          role: existingTeacher.role,
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "PRODUCTION",
          sameSite: "None",
        });
        return res.status(200).json({
          success: true,
          message: `Welcome back ${existingTeacher.name}`,
          accessToken,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
module.exports = { teacherRegister, teacherLogin };
