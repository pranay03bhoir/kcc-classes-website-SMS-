const Teacher = require("../models/teacher.model");
const Student = require("../models/student.model");
const Attendance = require("../models/attendance.model");
const Score = require("../models/score.model");
// const mongoose = require("mongoose");
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
    const { email, password, rememberMe } = req.body;
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
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const cookieExpiration = rememberMe
          ? 30 * 24 * 60 * 60 * 1000
          : 1 * 60 * 60 * 1000;
        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "PRODUCTION",
          sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Lax" : "None",
          maxAge: cookieExpiration,
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
      sameSite: "Lax",
      expires: new Date(0),
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
// ADDED FEATURE WHERE ATTENDANCE CANNOT BE ADDED FOR SAME COURSE.
const addStudentAttendance = async (req, res) => {
  try {
    const { student, course, status } = req.body;

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
    const existingAttendance = await Attendance.findOne({
      student,
      course,
    });
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already exists for this course",
      });
    }
    await attendance.save();

    const updatedStudent = await Student.findByIdAndUpdate(
      student,
      {
        $addToSet: { attendance: attendance },
      },
      { new: true, runValidators: true },
    )
      .select("name email contact parentsContact address courses attendance")
      .populate("attendance", "student course status date");

    res.status(200).json({
      success: true,
      message: "Student attendance added successfully",
      student: updatedStudent,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};
const updateStudentAttendance = async (req, res) => {
  try {
    const { studentId, attendanceId } = req.params;
    const { status } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      {
        status,
      },
      { new: true, runValidators: true },
    );
    if (!updatedAttendance) {
      return res.status(400).json({
        success: false,
        message: "Error updating attendance",
      });
    }
    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("Error updating student attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({})
      .select("student course status date")
      .populate("student", "name email")
      .populate("course", "name");
    if (attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Attendance retrieved successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getAttendanceForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const attendance = await Attendance.find({ student: studentId })
      .select("course status date")
      .populate("course", "name");
    if (attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Attendance retrieved successfully",
      attendance,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const addStudentScores = async (req, res) => {
  try {
    const { studentId, course, examType, score } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    } else if (!student.courses.includes(course)) {
      return res.status(404).json({
        success: false,
        message: "Student not enrolled in this course",
      });
    } else {
      const existingScore = await Score.findOne({
        studentId: studentId,
        course: course,
        examType: examType,
      });

      if (existingScore) {
        return res.status(400).json({
          success: false,
          message: "Score already exists for this exam type and course",
        });
      }
      const studentScore = new Score({
        studentId: studentId,
        course,
        examType,
        score,
      });
      await studentScore.save();
      const updateStudentScore = await Student.findByIdAndUpdate(
        studentId,
        {
          $addToSet: { scores: studentScore },
        },
        { new: true, runValidators: true },
      )
        .select("name email contact parentsContact address courses scores")
        .populate("courses", "name");

      if (!updateStudentScore) {
        return res.status(400).json({
          success: false,
          message: "Error adding score",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Score added successfully",
          student: updateStudentScore,
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
const updateStudentScores = async (req, res) => {
  try {
    const { scoreId } = req.params;
    const { score } = req.body;
    if (!scoreId) {
      return res.status(400).json({
        success: false,
        message: "Score ID is required",
      });
    }
    const scoreExists = await Score.findById(scoreId);
    if (!scoreExists) {
      return res.status(404).json({
        success: false,
        message: "Score not found",
      });
    } else {
      const updateScore = await Score.findByIdAndUpdate(
        scoreId,
        {
          score: score,
        },
        { new: true, runValidators: true },
      )
        .select("studentId course examType score date")
        .populate("course", "name")
        .populate("studentId", "name ");
      if (!updateScore) {
        return res.status(400).json({
          success: false,
          message: "Error updating score",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Score updated successfully",
          score: updateScore,
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
module.exports = {
  teacherRegister,
  teacherLogin,
  teacherLogout,
  getAllStudents,
  getStudentById,
  addStudentAttendance,
  updateStudentAttendance,
  getAllAttendance,
  getAttendanceForStudent,
  addStudentScores,
  updateStudentScores,
};
