/**
 * @fileoverview Student controller handling all student-related operations including registration,
 * authentication, profile management, and subject enrollment.
 */

const joi = require("joi");
const Student = require("../models/student.model");
const Testimonial = require("../models/testimonial.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/student.email.js");
const { populate } = require("../models/counterStudent.model.js");
const { default: mongoose } = require("mongoose");

/**
 * Joi validation schema for student registration
 * @type {joi.ObjectSchema}
 */
const studentSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  contact: joi.string().min(10).max(13).required(),
  parentsContact: joi.array().items(joi.string().min(10).max(13).required()),
  admissionYear: joi.number().required(),
  address: joi.string().required(),
  currentStd: joi.string(),
  profileImage: joi.string().optional(),
});

/**
 * Register a new student
 * @async
 * @function studentRegister
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Student's full name
 * @param {string} req.body.email - Student's email address
 * @param {string} req.body.password - Student's password (min 8 characters)
 * @param {string} req.body.contact - Student's contact number (10-13 digits)
 * @param {string[]} req.body.parentsContact - Array of parent contact numbers
 * @param {number} req.body.admissionYear - Year of admission
 * @param {string} req.body.address - Student's address
 * @param {string} [req.body.currentStd] - Current standard/grade
 * @param {string} [req.body.profileImage] - URL to profile image
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with success status and message
 * @throws {Error} When registration fails or validation error occurs
 */
const studentRegister = async (req, res) => {
  try {
    const { error } = studentSchema.validate(req.body);
    if (!error)
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    const {
      name,
      email,
      password,
      contact,
      parentsContact,
      address,
      currentStd,
      admissionYear,
    } = req.body;
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
        parentsContact,
        address,
        currentStd,
        admissionYear,
      });
      await student.save();
      const token = jwt.sign({ email: student.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      await sendVerificationEmail(student.email, token);
      if (student) {
        res.status(200).json({
          success: true,
          message:
            "Student registered successfully, A link has been sent to your email for verification",
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

/**
 * Verify student's email address using token
 * @async
 * @function studentVerifyEmail
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.token - JWT verification token
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with verification status
 * @throws {Error} When verification fails or token is invalid
 */
const studentVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findOne({ email: decoded.email });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or verification link expired",
      });
    }
    student.isVerified = true;
    await student.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully!, you can log in now",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

/**
 * Resend verification email to unverified student
 * @async
 * @function resendVerificationEmail
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - Student's email address
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with email status
 * @throws {Error} When email sending fails or student not found
 */
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email: email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    if (student.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }
    const token = jwt.sign({ email: student.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await sendVerificationEmail(student.email, token);
    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

/**
 * Authenticate student and generate access tokens
 * @async
 * @function studentLogin
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - Student's email address
 * @param {string} req.body.password - Student's password
 * @param {boolean} [req.body.rememberMe] - Whether to extend token validity
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with tokens and user info
 * @throws {Error} When authentication fails or email not verified
 */
const studentLogin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const existingStudent = await Student.findOne({ email: email });
    if (!existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials or register to continue",
      });
    } else if (!existingStudent.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    } else {
      const student = await bcrypt.compare(password, existingStudent.password);
      if (student) {
        const payload = {
          id: existingStudent._id,
          email: existingStudent.email,
          role: existingStudent.role,
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
          expiresIn: "30d",
        });
        existingStudent.refreshToken = refreshToken;
        await existingStudent.save();
        const cookieExpiration = rememberMe
          ? 30 * 24 * 60 * 60 * 1000
          : 1 * 60 * 60 * 1000;
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

/**
 * Check if student's session is valid
 * @async
 * @function studentAuthCheck
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Request cookies
 * @param {string} req.cookies.refreshToken - Refresh token from cookie
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with authentication status
 * @throws {Error} When token validation fails
 */
const studentAuthCheck = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (tokenIsValid(token)) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return res.status(200).json({
        success: true,
        message: "Access granted",
        data: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
      });
    }
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Generate new access and refresh tokens
 * @async
 * @function generateNewRefreshAccessToken
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Request cookies
 * @param {string} req.cookies.refreshToken - Current refresh token
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with new tokens
 * @throws {Error} When token generation fails or refresh token invalid
 */
const generateNewRefreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const student = await Student.findOne({ refreshToken: refreshToken });
    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, user) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
          });
        }

        const newAccessToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const newRefreshToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "30d" }
        );

        student.refreshToken = newRefreshToken;
        await student.save();

        const isProd = process.env.NODE_ENV === "PRODUCTION";
        const isCrossSite = process.env.CROSS_SITE === "true"; // ensure this is set in your .env

        const getCookieOptions = (maxAge) => ({
          httpOnly: true,
          secure: isProd, // only true in production
          sameSite: isCrossSite ? "None" : isProd ? "Lax" : "Strict",
          maxAge,
        });

        res.cookie(
          "accessToken",
          newAccessToken,
          getCookieOptions(60 * 60 * 1000)
        ); // 1 hour
        res.cookie(
          "refreshToken",
          newRefreshToken,
          getCookieOptions(30 * 24 * 60 * 60 * 1000)
        ); // 30 days

        return res.status(200).json({
          success: true,
          message: "New access token generated",
          newAccessToken,
          data: student,
        });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Logout student by invalidating tokens
 * @async
 * @function studentLogout
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Request cookies
 * @param {string} req.cookies.refreshToken - Refresh token to invalidate
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with logout status
 * @throws {Error} When logout process fails
 */
const studentLogout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies || {};

    const isProd = process.env.NODE_ENV === "PRODUCTION";
    const isCrossSite = process.env.CROSS_SITE === "true";
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

    const getClearCookieOptions = () => ({
      httpOnly: true,
      secure: isProd,
      sameSite: isCrossSite ? "None" : isProd ? "Lax" : "Strict",
      path: "/",
      domain: cookieDomain,
    });

    if (refreshToken) {
      try {
        await Student.updateOne(
          { refreshToken: refreshToken },
          { $unset: { refreshToken: "" } }
        );
      } catch (dbErr) {
        console.error("Student logout: failed to unset refreshToken:", dbErr);
      }
    }

    ["accessToken", "refreshToken"].forEach((cookieName) => {
      res.clearCookie(cookieName, getClearCookieOptions());
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

/**
 * Get detailed information about logged-in student
 * @async
 * @function getStudentDetails
 * @param {Object} req - Express request object
 * @param {Object} req.userInfo - User information from auth middleware
 * @param {string} req.userInfo.id - Student's ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with student details
 * @throws {Error} When student not found or data retrieval fails
 */
const getStudentDetails = async (req, res) => {
  try {
    const studentId = req.userInfo.id;
    const student = await Student.findById(studentId)
      .select(
        "studentId name email contact parentsContact address currentStd admissionYear profileImage batches scores subjects attendance role createdAt updatedAt"
      )
      .populate({
        path: "subjects",
        select:
          "name code description teachers category duration gradeLevel classesPerWeek rating createdAt updatedAt",
        populate: {
          path: "teachers",
          select: "name email contact profileImage",
        },
      })
      .populate({
        path: "batches",
        select: "name classStd timings subjectId teacherId batchId",
        populate: {
          path: "teacherId",
          select: "name email contact profileImage",
        },
        populate: {
          path: "subjectId",
          select: "name code description category duration classesPerWeek",
        },
      })
      .populate({
        path: "scores",
        select: "subject score date examType",
        populate: {
          path: "subject",
          select: "name code description",
        },
      })
      .populate({
        path: "attendance",
        select: "subject date status",
        populate: {
          path: "subject",
          select: "name code description",
        },
      })
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (e) {
    console.error("Error in getStudentDetails:", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Update student's profile information
 * @async
 * @function updateStudentProfile
 * @param {Object} req - Express request object
 * @param {Object} req.userInfo - User information from auth middleware
 * @param {string} req.userInfo.id - Student's ID
 * @param {Object} req.body - Request body
 * @param {string} [req.body.name] - Updated name
 * @param {string} [req.body.password] - New password
 * @param {string} [req.body.contact] - Updated contact number
 * @param {string[]} [req.body.parentsContact] - Updated parent contacts
 * @param {string} [req.body.address] - Updated address
 * @param {string} [req.body.profileImage] - Updated profile image URL
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with update status
 * @throws {Error} When update fails or validation error occurs
 */
const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.userInfo.id;
    const {
      name,
      password,
      contact,
      parentsContact,
      address,
      profileImage,
      currentStd,
    } = req.body;

    // Fetch the current student record
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Prepare the fields to update
    const updateFields = {
      name,
      contact,
      parentsContact,
      address,
      profileImage,
      currentStd,
    };

    // If a new password is provided, check if it's different from the current password
    if (password) {
      const isSamePassword = await bcrypt.compare(password, student.password);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          message: "Please enter a new password",
        });
      }
      const genSalt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, genSalt);
    }

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

/**
 * Get subjects enrolled by the student
 * @async
 * @function getStudentSubjects
 * @param {Object} req - Express request object
 * @param {Object} req.userInfo - User information from auth middleware
 * @param {string} req.userInfo.id - Student's ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with student's subjects
 * @throws {Error} When subject retrieval fails
 */
const getStudentSubjects = async (req, res) => {
  try {
    const studentId = req.userInfo.id;
    const student = await Student.findById(studentId)
      .select("name email")
      .populate("subjects", "name description");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Details not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        data: student,
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getStudentScores = async (req, res) => {
  try {
    const studentId = req.userInfo.id;
    let studentObjectId;
    try {
      studentObjectId = new mongoose.Types.ObjectId(studentId);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }
    const student = await Student.findById(studentObjectId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const scores = await Student.aggregate([
      { $match: { _id: studentObjectId } },
      {
        $lookup: {
          from: "scores",
          localField: "scores",
          foreignField: "_id",
          as: "scoresDetails",
        },
      },
      {
        $unwind: "$scoresDetails",
      },
      {
        $lookup: {
          from: "subjects",
          localField: "scoresDetails.subject",
          foreignField: "_id",
          as: "subjectDetails",
        },
      },
      {
        $unwind: "$subjectDetails",
      },
      {
        $project: {
          _id: 0,
          subjectName: "$subjectDetails.name",
          score: "$scoresDetails.score",
          date: "$scoresDetails.date",
          examType: "$scoresDetails.examType",
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      scores,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.userInfo.id;
    let studentObjectId;
    try {
      studentObjectId = new mongoose.Types.ObjectId(studentId);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }
    const student = await Student.findById(studentObjectId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const attendance = await Student.aggregate([
      { $match: { _id: studentObjectId } },
      {
        $lookup: {
          from: "attendances",
          localField: "attendance",
          foreignField: "_id",
          as: "attendanceDetails",
        },
      },
      { $unwind: "$attendanceDetails" },
      {
        $lookup: {
          from: "subjects",
          localField: "attendanceDetails.subject",
          foreignField: "_id",
          as: "subjectDetails",
        },
      },
      { $unwind: "$subjectDetails" },
      {
        $project: {
          _id: 0,
          subjectName: "$subjectDetails.name",
          date: "$attendanceDetails.date",
          status: "$attendanceDetails.status",
          note: "$attendanceDetails.note",
          createdAt: "$attendanceDetails.createdAt",
        },
      },
    ]);
    return res.status(200).json({
      success: true,
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
const testimonialBodySchema = joi.object({
  rating: joi.number().integer().min(1).max(5).required(),
  text: joi.string().trim().min(20).max(2000).required(),
});

const upsertStudentTestimonial = async (req, res) => {
  try {
    if (!req.userInfo || req.userInfo.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can submit testimonials",
      });
    }
    const { error, value } = testimonialBodySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const studentId = req.userInfo.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const std = (student.currentStd || "").trim();
    const displayRole = std ? `${std} Student` : "Student";

    const testimonial = await Testimonial.findOneAndUpdate(
      { student: studentId },
      {
        $set: {
          rating: value.rating,
          text: value.text,
          status: "approved",
          displayName: student.name || "",
          displayRole,
          displayImage: (student.profileImage && String(student.profileImage).trim()) || "",
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Thank you! Your testimonial has been saved.",
      testimonial: {
        id: testimonial._id,
        rating: testimonial.rating,
        text: testimonial.text,
        status: testimonial.status,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getMyTestimonial = async (req, res) => {
  try {
    if (!req.userInfo || req.userInfo.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    const doc = await Testimonial.findOne({ student: req.userInfo.id }).lean();
    if (!doc) {
      return res.status(200).json({ success: true, testimonial: null });
    }
    return res.status(200).json({
      success: true,
      testimonial: {
        id: doc._id,
        rating: doc.rating,
        text: doc.text,
        status: doc.status,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getStudentLeaderboard = async (req, res) => {
  try {
    const leaderBoard = await Student.aggregate([
      {
        $lookup: {
          from: "scores",
          localField: "scores",
          foreignField: "_id",
          as: "scoresDetails",
        },
      },
      {
        $unwind: "$scoresDetails",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          totalScore: { $sum: "$scoresDetails.score" },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    return res.status(200).json({
      success: true,
      leaderBoard,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  studentRegister,
  studentVerifyEmail,
  resendVerificationEmail,
  studentLogin,
  studentAuthCheck,
  generateNewRefreshAccessToken,
  studentLogout,
  getStudentDetails,
  updateStudentProfile,
  getStudentSubjects,
  getStudentScores,
  getStudentAttendance,
  getStudentLeaderboard,
  upsertStudentTestimonial,
  getMyTestimonial,
};
