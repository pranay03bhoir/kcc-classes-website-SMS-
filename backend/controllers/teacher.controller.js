const joi = require("joi");
const Teacher = require("../models/teacher.model");
const Student = require("../models/student.model");
const Attendance = require("../models/attendance.model");
const Score = require("../models/score.model");
const Batch = require("../models/batch.model");
// const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/email");
const teacherSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  contact: joi.string().min(10).max(13).required(),
  alternateContact: joi.string().min(10).max(13).required(),
  address: joi.string().required(),
  joiningYear: joi.number().required(),
});
const teacherRegister = async (req, res) => {
  try {
    const { error } = teacherSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const {
      name,
      email,
      password,
      contact,
      alternateContact,
      address,
      joiningYear,
    } = req.body;
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
        joiningYear,
      });
      await teacher.save();
      const token = jwt.sign({ email: teacher.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      await sendVerificationEmail(teacher.email, token);
      if (teacher) {
        res.status(200).json({
          success: true,
          message:
            "Teacher registered successfully!, A link has been sent to your email for verification",
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
const teacherVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await Teacher.findOne({ email: decoded.email });
    if (!teacher) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or expired verification link",
      });
    }
    teacher.isVerified = true;
    await teacher.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (e) {
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
    } else if (!existingTeacher.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email",
      });
    } else {
      const teacher = await bcrypt.compare(password, existingTeacher.password);
      if (teacher) {
        const payload = {
          id: existingTeacher._id,
          email: existingTeacher.email,
          role: existingTeacher.role,
        };
        const cookieExpiration = rememberMe
          ? 30 * 24 * 60 * 60 * 1000
          : 1 * 60 * 60 * 1000;
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
          expiresIn: "30d",
        });
        existingTeacher.refreshToken = refreshToken;
        existingTeacher.save();
        const isProd = process.env.NODE_ENV === "PRODUCTION";
        const isCrossSite = process.env.CROSS_SITE === "true"; // you set this in .env

        const getCookieOptions = (maxAge) => ({
          httpOnly: true,
          secure: isProd, // must be true in production
          sameSite: isCrossSite ? "None" : isProd ? "Lax" : "Strict",
          maxAge,
        });
        res.cookie("accessToken", accessToken, getCookieOptions(60 * 60 * 100));
        res.cookie(
          "refreshToken",
          refreshToken,
          getCookieOptions(cookieExpiration)
        );
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
const generateNewAccessRefreshToken = async (req, res) => {
  const refreshToken = req.params.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Access denied",
    });
  }
  const teacher = await Teacher.findOne({ refreshToken: refreshToken });
  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid token or Expired token",
        });
      }
      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const newRefreshToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "30d",
        }
      );
      teacher.refreshToken = newRefreshToken;
      await teacher.save();
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Lax" : "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Lax" : "None",
        maxAge: 60 * 60 * 100,
      });
      return res.status(200).json({
        success: true,
        message: "New access token generated",
        newAccessToken,
      });
    }
  );
};
const teacherLogout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(203).send();
    }
    await Teacher.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });

    const cookiesToClear = ["accessToken", "refreshToken"];
    cookiesToClear.forEach((cookie) => {
      res.clearCookie(cookie, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: "Lax",
        expires: new Date(0),
      });
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
      .select(
        "name email contact parentsContact address subjects attendance batches studentId"
      )
      .populate("subjects", "name")
      .populate("attendance", "subject status date")
      .populate("batches", "batchId name timing");
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
      .select("name email contact parentsContact address subjects attendance")
      .populate("subjects", "name")
      .populate("attendance", "subject status date");
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
const updateStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, email, contact, address, batches } = req.body;

    // Fetch the current student record
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Prepare the fields to update
    const updateFields = {};

    // Only update fields if they are provided in the request
    if (name) updateFields.name = name;
    if (contact) updateFields.contact = contact;
    if (email) updateFields.email = email;
    if (batches) updateFields.batches = batches;
    if (address) updateFields.address = address;

    // Update the student record with new data
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Details updated successfully.",
      data: updatedStudent,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
// ADDED FEATURE WHERE ATTENDANCE CANNOT BE ADDED FOR SAME COURSE.
const addStudentAttendance = async (req, res) => {
  try {
    const { student, subject, status, note } = req.body;

    if (!student || !subject || !status) {
      return res
        .status(400)
        .json({ message: "student, subject, and status are required." });
    }

    // Normalize today's date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already exists for today
    const existing = await Attendance.findOne({
      student,
      subject,
      date: { $gte: today },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Attendance already marked for today." });
    }

    const attendance = new Attendance({
      student,
      subject,
      status,
      note: note || "",
    });

    await attendance.save();

    res
      .status(201)
      .json({ message: "Attendance marked successfully.", attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error." });
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
      { new: true, runValidators: true }
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
      .select("student subject status date")
      .populate("student", "name email")
      .populate("subject", "name");
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
      .select("subject status date")
      .populate("subject", "name");
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
    const { studentId, subject, examType, score } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    } else if (!student.subjects.includes(subject)) {
      return res.status(404).json({
        success: false,
        message: "Student not enrolled in this subject",
      });
    } else {
      const existingScore = await Score.findOne({
        studentId: studentId,
        subject: subject,
        examType: examType,
      });

      if (existingScore) {
        return res.status(400).json({
          success: false,
          message: "Score already exists for this exam type and subject",
        });
      }
      const studentScore = new Score({
        studentId: studentId,
        subject,
        examType,
        score,
      });
      await studentScore.save();
      const updateStudentScore = await Student.findByIdAndUpdate(
        studentId,
        {
          $addToSet: { scores: studentScore },
        },
        { new: true, runValidators: true }
      )
        .select("name email contact parentsContact address subjects scores")
        .populate("subjects", "name");

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
        { new: true, runValidators: true }
      )
        .select("studentId subject examType score date")
        .populate("subject", "name")
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
const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find({});
    if (!batches || batches.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Batches not found" });
    }
    res.status(200).json({
      success: true,
      message: "Batches found",
      batches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getTeacherDetails = async (req, res) => {
  try {
    const teacherId = req.userInfo.id; // Assuming userInfo is set by the auth middleware
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required",
      });
    }
    // Fetch teacher details along with populated batches
    // and their respective subjects and students
    const teacher = await Teacher.findById(teacherId)
      .select("name email contact alternateContact address joiningYear")
      .populate({
        path: "batches",
        select: "batchId name timing subjectId studentIds",
        populate: {
          path: "studentIds",
          select: "name email contact attendance",
          populate: {
            path: "attendance",
            select: "subject status date",
          },
        },
      });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Teacher details retrieved successfully",
      teacher,
    });
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
  teacherVerifyEmail,
  generateNewAccessRefreshToken,
  teacherLogout,
  getAllStudents,
  updateStudentDetails,
  getStudentById,
  addStudentAttendance,
  updateStudentAttendance,
  getAllAttendance,
  getAttendanceForStudent,
  addStudentScores,
  updateStudentScores,
  getAllBatches,
  getTeacherDetails,
};
