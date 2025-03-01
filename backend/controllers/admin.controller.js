const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
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
      });
    } else {
      const adminUser = await bcrypt.compare(password, existingUser.password);
      if (adminUser) {
        const payload = {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({
          success: true,
          message: "Login successfully",
          accessToken: accessToken,
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Login failed",
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
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    if (!students) {
      res.status(404).json({
        success: false,
        message: "No students found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Students found",
        students: students,
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
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    if (!teachers) {
      res.status(404).json({
        success: false,
        message: "No teachers found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Teachers found",
        teachers: teachers,
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
const getStudentsById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Student found",
        student: student,
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
const getTeachersById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Teacher found",
        teacher: teacher,
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
const updateTeachersDetails = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { name, email, password, contact, address } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        name: name,
        email: email,
        password: password,
        contact: contact,
        address: address,
      },
      { new: true, runValidators: true },
    );
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Teacher details updated",
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
const updateStudentsDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, email, password, contact, address } = req.body;
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        name: name,
        email: email,
        password: password,
        contact: contact,
        address: address,
      },
      { new: true, runValidators: true },
    );
    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Student details updated",
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
const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findByIdAndDelete(teacherId);
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Teacher deleted",
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
const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByIdAndDelete(studentId);
    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Student deleted",
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
module.exports = {
  adminRegister,
  adminLogin,
  getAllStudents,
  getAllTeachers,
  getStudentsById,
  getTeachersById,
  updateTeachersDetails,
  updateStudentsDetails,
  deleteTeacher,
  deleteStudent,
};
