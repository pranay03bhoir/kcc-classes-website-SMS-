const Student = require("../models/student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentRegister = async (req, res) => {
  try {
    const { name, email, password, contact, address } = req.body;
    const existingStudent = await Student.findOne({ email: email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const student = new Student({
        name,
        email,
        password: hashedPassword,
        contact,
        address,
      });
      await student.save();
      if (student) {
        res.status(200).json({
          success: true,
          message: "Student registered successfully",
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
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingStudent = await Student.findOne({ email: email });
    if (!existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Please register first",
      });
    } else {
      const student = await bcrypt.compare(password, existingStudent.password);
      if (student) {
        const payload = {
          id: existingStudent._id,
          email: existingStudent.email,
          role: existingStudent.role,
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "PRODUCTION",
          sameSite: "None",
        });
        return res.status(200).json({
          success: true,
          message: `Welcome back ${existingStudent.name}`,
          accessToken,
        });
      } else {
        return res.status(401).json({
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
// const studentLogout = async (req, res) => {
//   try {
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong.",
//     });
//   }
// };
const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const student = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Details updated successfully.",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Some thing went wrong.",
    });
  }
};

module.exports = { studentRegister, studentLogin, updateStudentProfile };
