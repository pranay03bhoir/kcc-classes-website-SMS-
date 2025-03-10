const Teacher = require("../models/teacher.model");
const Student = require("../models/student.model");
const Attendance = require("../models/attendance.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const teacherRegister = async (req, res) => {
  try {
    const { name, email, password, contact, alternateContact, address } =
      req.body;
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
        alternateContact,
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
const teacherLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "None",
    });
    res.status(200).json({
      success: true,
      message: "Teacher logged out",
    });
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
    const students = await Student.find({})
      .select("name email contact parentsContact address courses attendance")
      .populate("courses", "name")
      .populate("attendance", "course status date");
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Students retrieved successfully",
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId)
      .select("name email contact parentsContact address courses attendance")
      .populate("courses", "name")
      .populate("attendance", "course status date");
    if (student) {
      return res.status(200).json({
        success: true,
        message: "Student retrieved successfully",
        student,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Student not found",
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
// ADD FEATURE WHERE ATTENDANCE CANNOT BE ADDED FOR SAME COURSE.
const addStudentAttendance = async (req, res) => {
  try {
    const { student, course, status } = req.body; // ✅ FIXED: req.body instead of res.body

    // ✅ Check if student exists
    // const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ✅ Create new attendance record
    const attendance = new Attendance({
      student,
      course,
      status,
    });

    await attendance.save();

    // ✅ Update student document with attendance reference
    const updatedStudent = await Student.findByIdAndUpdate(
      student,
      {
        $addToSet: { attendance: attendance },
      },
      { new: true, runValidators: true },
    )
      .select("name email contact parentsContact address courses attendance")
      .populate("attendance", "student course status date"); // ✅ Populate attendance for better response

    res.status(200).json({
      success: true,
      message: "Student attendance added successfully",
      student: updatedStudent, // ✅ Return updated student
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: e.message, // ✅ Send error details for debugging
    });
  }
};

module.exports = {
  teacherRegister,
  teacherLogin,
  teacherLogout,
  getAllStudents,
  getStudentById,
  addStudentAttendance,
};
