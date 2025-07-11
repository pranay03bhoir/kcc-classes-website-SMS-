/**
 * @fileoverview Admin controller containing all admin-related operations including user management,
 * attendance tracking, subject management, and batch operations.
 */

const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Subject = require("../models/subject.model");
const Attendance = require("../models/attendance.model");
const Score = require("../models/score.model");
const Batch = require("../models/batch.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { sendVerificationEmail } = require("../utils/admin.email.js");

/**
 * Registers a new admin user in the system
 * @async
 * @function adminRegister
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing admin details
 * @param {string} req.body.name - Admin's full name
 * @param {string} req.body.email - Admin's email address
 * @param {string} req.body.password - Admin's password (will be hashed)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and message
 * @throws {Error} If registration fails or user already exists
 */
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
      const admin = new Admin({
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

/**
 * Authenticates an admin user and generates access/refresh tokens
 * @async
 * @function adminLogin
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.email - Admin's email address
 * @param {string} req.body.password - Admin's password
 * @param {boolean} req.body.rememberMe - Whether to extend token expiration
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with tokens and success message
 * @throws {Error} If authentication fails or user not found
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
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
        const cookieExpiration = rememberMe
          ? 30 * 24 * 60 * 60 * 1000
          : 1 * 60 * 60 * 1000;
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
          expiresIn: "30d",
        });
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
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

/**
 * Generates new access and refresh tokens using existing refresh token
 * @async
 * @function generateNewRefreshAccessToken
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Request cookies containing refresh token
 * @param {string} req.cookies.refreshToken - Current refresh token
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with new tokens
 * @throws {Error} If token refresh fails or token invalid
 */
const generateNewRefreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const admin = await Admin.findOne({ refreshToken: refreshToken });
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
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
        const payload = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const newRefreshToken = jwt.sign(
          payload,
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: "30d",
          }
        );
        admin.refreshToken = newRefreshToken;
        await admin.save();
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
          accessToken: newAccessToken,
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
 * Logs out an admin user by clearing tokens
 * @async
 * @function adminLogout
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Request cookies containing refresh token
 * @param {string} req.cookies.refreshToken - Current refresh token
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If logout process fails
 */
const adminLogout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(204).send();
    }
    await Admin.updateOne(
      { refreshToken: refreshToken },
      { $unset: { refreshToken: "" } }
    );
    const clearCookies = ["accessToken", "refreshToken"];
    clearCookies.forEach((cookie) => {
      res.clearCookie(cookie, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Lax" : "None",
      });
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
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
 * Resend verification email to unverified teacher
 * @async
 * @function resendVerificationEmailTeacher
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - Admin's email address
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with email status
 * @throws {Error} When email sending fails or teacher not found
 */
const resendVerificationEmailAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    if (admin.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await sendVerificationEmail(admin.email, token);
    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (e) {
    console.error("Error in resendVerificationEmailTeacher:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

/**
 * Retrieves details of the currently logged-in admin
 * @async
 * @function getAdminDetails
 * @param {Object} req - Express request object
 * @param {Object} req.userInfo - User info from auth middleware
 * @param {string} req.userInfo.id - Admin's ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with admin details
 * @throws {Error} If admin not found or retrieval fails
 */
const getAdminDetails = async (req, res) => {
  try {
    const adminId = req.userInfo.id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Admin details fetched",
      admin,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Updates details of the currently logged-in admin
 * @async
 * @function updateAdminDetails
 * @param {Object} req - Express request object
 * @param {Object} req.userInfo - User info from auth middleware
 * @param {string} req.userInfo.id - Admin's ID
 * @param {Object} req.body - Request body containing updated details
 * @param {string} [req.body.name] - Updated admin name
 * @param {string} [req.body.email] - Updated email address
 * @param {string} [req.body.password] - Updated password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated admin details
 * @throws {Error} If update fails, admin not found, or email already exists
 */
const updateAdminDetails = async (req, res) => {
  try {
    const adminId = req.userInfo.id;
    const { name, email, password } = req.body;

    // Fetch the current admin record
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prepare the fields to update
    const updateFields = {};

    // Only update fields if they are provided in the request
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    // If a new password is provided, handle hashing it
    if (password) {
      // Check if the provided password is plain text (not already hashed)
      if (password.length < 60) {
        // A typical bcrypt hash is 60 characters long
        const isSamePassword = await bcrypt.compare(password, admin.password);
        if (isSamePassword) {
          return res.status(400).json({
            success: false,
            message: "Please enter a new password",
          });
        }
        // Hash the password if it's plain text
        const genSalt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(password, genSalt);
      } else {
        // If the password is already a hash (length > 60), do not hash again
        updateFields.password = password;
      }
    }

    // If email is being updated, check if it already exists
    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ email: email });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Update the admin record with new data
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateFields, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Admin details updated successfully.",
      data: updatedAdmin,
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
 * Creates a new student account in the system
 * @async
 * @function createStudents
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing student details
 * @param {string} req.body.name - Student's full name
 * @param {string} req.body.email - Student's email address
 * @param {string} req.body.password - Student's password
 * @param {string} req.body.contact - Student's contact number
 * @param {string|Array<string>} req.body.parentsContact - Parent's contact number(s)
 * @param {string} req.body.address - Student's address
 * @param {string} [req.body.currentStd] - Current standard/grade
 * @param {number} req.body.admissionYear - Year of admission
 * @param {boolean} [req.body.isVerified] - Whether student is verified
 * @param {boolean} [req.body.isAdmitted] - Whether student is admitted
 * @param {string} [req.body.profileImage] - Profile image URL
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If student creation fails or email already exists
 */
const createStudents = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contact,
      parentsContact,
      address,
      currentStd,
      admissionYear,
      isVerified,
      isAdmitted,
      profileImage,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !contact ||
      !parentsContact ||
      !address ||
      !admissionYear
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (name, email, password, contact, parentsContact, address, admissionYear) must be provided",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate admission year
    const currentYear = new Date().getFullYear();
    if (admissionYear < 2000 || admissionYear > currentYear + 1) {
      return res.status(400).json({
        success: false,
        message: `Admission year must be between 2000 and ${currentYear + 1}`,
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Student with email ${email} already exists. Kindly login`,
      });
    }

    // Handle parentsContact - ensure it's an array
    const parentsContactArray = Array.isArray(parentsContact)
      ? parentsContact
      : [parentsContact];

    // Validate parents contact numbers
    const contactRegex = /^[0-9]{10}$/;
    for (const contactNum of parentsContactArray) {
      if (!contactRegex.test(contactNum)) {
        return res.status(400).json({
          success: false,
          message: "Parent contact numbers must be 10-digit numbers",
        });
      }
    }

    // Validate student contact number
    if (!contactRegex.test(contact)) {
      return res.status(400).json({
        success: false,
        message: "Student contact number must be a 10-digit number",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student object
    const studentData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      contact: contact.trim(),
      parentsContact: parentsContactArray,
      address: address.trim(),
      admissionYear: parseInt(admissionYear),
      role: "student",
      isVerified: isVerified || false,
      isAdmitted: isAdmitted || false,
    };

    // Add optional fields if provided
    if (currentStd) studentData.currentStd = currentStd.trim();
    if (profileImage) studentData.profileImage = profileImage.trim();

    const student = new Student(studentData);
    await student.save();

    // Send verification email
    const token = jwt.sign({ email: student.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    try {
      await sendVerificationEmail(student.email, token);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue with student creation even if email fails
    }

    res.status(201).json({
      success: true,
      message:
        "Student registered successfully. A verification link has been sent to your email.",
      student: {
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        isVerified: student.isVerified,
        isAdmitted: student.isAdmitted,
      },
    });
  } catch (e) {
    console.error("Error creating student:", e);

    // Handle specific MongoDB errors
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong while creating student",
    });
  }
};

/**
 * Updates details of an existing student
 * @async
 * @function updateStudentDetails
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Student's ID
 * @param {Object} req.body - Request body containing updated details
 * @param {string} [req.body.name] - Updated student name
 * @param {string} [req.body.email] - Updated email address
 * @param {string} [req.body.password] - Updated password
 * @param {string} [req.body.contact] - Updated contact number
 * @param {string|Array<string>} [req.body.parentsContact] - Updated parent's contact(s)
 * @param {string} [req.body.address] - Updated address
 * @param {string} [req.body.currentStd] - Updated current standard
 * @param {string} [req.body.profileImage] - Updated profile image URL
 * @param {number} [req.body.admissionYear] - Updated admission year
 * @param {boolean} [req.body.isVerified] - Updated verification status
 * @param {boolean} [req.body.isAdmitted] - Updated admission status
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated student details
 * @throws {Error} If update fails, student not found, or email already exists
 */
const updateStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      name,
      email,
      password,
      contact,
      parentsContact,
      address,
      currentStd,
      profileImage,
      admissionYear,
      isVerified,
      isAdmitted,
    } = req.body;

    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

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

    // Validate and update name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }
      updateFields.name = name.trim();
    }

    // Validate and update email
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      // Check if email already exists (excluding current student)
      const existingStudent = await Student.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: studentId },
      });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      updateFields.email = email.toLowerCase().trim();
    }

    // Validate and update contact
    if (contact !== undefined) {
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(contact)) {
        return res.status(400).json({
          success: false,
          message: "Contact number must be a 10-digit number",
        });
      }
      updateFields.contact = contact.trim();
    }

    // Validate and update parentsContact
    if (parentsContact !== undefined) {
      const parentsContactArray = Array.isArray(parentsContact)
        ? parentsContact
        : [parentsContact];

      if (parentsContactArray.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one parent contact number is required",
        });
      }

      // Validate each parent contact number
      const contactRegex = /^[0-9]{10}$/;
      for (const contactNum of parentsContactArray) {
        if (!contactRegex.test(contactNum)) {
          return res.status(400).json({
            success: false,
            message: "Parent contact numbers must be 10-digit numbers",
          });
        }
      }
      updateFields.parentsContact = parentsContactArray;
    }

    // Update address
    if (address !== undefined) {
      if (!address.trim()) {
        return res.status(400).json({
          success: false,
          message: "Address cannot be empty",
        });
      }
      updateFields.address = address.trim();
    }

    // Update currentStd
    if (currentStd !== undefined) {
      updateFields.currentStd = currentStd.trim();
    }

    // Update profileImage
    if (profileImage !== undefined) {
      updateFields.profileImage = profileImage.trim();
    }

    // Validate and update admissionYear
    if (admissionYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (admissionYear < 2000 || admissionYear > currentYear + 1) {
        return res.status(400).json({
          success: false,
          message: `Admission year must be between 2000 and ${currentYear + 1}`,
        });
      }
      updateFields.admissionYear = parseInt(admissionYear);
    }

    // Update boolean fields
    if (isVerified !== undefined) {
      updateFields.isVerified = Boolean(isVerified);
    }
    if (isAdmitted !== undefined) {
      updateFields.isAdmitted = Boolean(isAdmitted);
    }

    // Handle password update
    if (password !== undefined) {
      if (!password.trim()) {
        return res.status(400).json({
          success: false,
          message: "Password cannot be empty",
        });
      }

      // Check if the provided password is plain text (not already hashed)
      if (password.length < 60) {
        // A typical bcrypt hash is 60 characters long
        const isSamePassword = await bcrypt.compare(password, student.password);
        if (isSamePassword) {
          return res.status(400).json({
            success: false,
            message: "Please enter a new password",
          });
        }
        // Hash the password if it's plain text
        const genSalt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(password, genSalt);
      } else {
        // If the password is already a hash (length > 60), do not hash again
        updateFields.password = password;
      }
    }

    // Add updatedAt timestamp
    updateFields.updatedAt = new Date();

    // Update the student record with new data
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken"); // Exclude sensitive fields from response

    if (!updatedStudent) {
      return res.status(400).json({
        success: false,
        message: "Failed to update student details",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student details updated successfully.",
      data: updatedStudent,
    });
  } catch (e) {
    console.error("Error updating student details:", e);

    // Handle specific MongoDB errors
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating student details.",
    });
  }
};

/**
 * Retrieves all students with optional pagination
 * @async
 * @function getAllStudents
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with list of students
 * @throws {Error} If retrieval fails or no students found
 */
const getAllStudents = async (req, res) => {
  try {
    // const { page, limit } = req.query;
    // const pageNumber = parseInt(page) || 1;
    // const limitNumber = parseInt(limit) || 10;
    // const skip = (pageNumber - 1) * limitNumber;
    // const totalStudents = await Student.countDocuments();
    const students = await Student.find({})
      .populate("subjects")
      .populate("batches")
      .populate("attendance")
      .populate({
        path: "scores",
        populate: {
          path: "subject",
        },
      });
    if (!students || students.length === 0) {
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

/**
 * Retrieves all students with pagination support
 * @async
 * @function getAllStudentsWithPagination
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number
 * @param {number} [req.query.limit=10] - Items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated students list
 * @throws {Error} If retrieval fails or no students found
 */
const getAllStudentsWithPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const totalStudents = await Student.countDocuments();
    const students = await Student.find({})
      .skip(skip)
      .limit(limit)
      .populate("subjects")
      .populate("batches")
      .populate("attendance")
      .populate({
        path: "scores",
        populate: {
          path: "subject",
        },
      });
    if (!students || students.length === 0) {
      res.status(404).json({
        success: false,
        message: "No students found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Students found",
        students: students,
        totalStudents: totalStudents,
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

/**
 * Searches for students based on a query string
 * @async
 * @function searchAStudent
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.searchQuery - Search term
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with matching students
 * @throws {Error} If search fails or no matches found
 */
const searchAStudent = async (req, res) => {
  try {
    const { searchQuery } = req.query;
    if (!searchQuery || searchQuery.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const matchedStudents = await Student.find({
      $or: [
        { $text: { $search: searchQuery } },
        { email: { $regex: searchQuery, $options: "i" } },
        { studentId: { $regex: searchQuery, $options: "i" } },
      ],
    });

    if (!matchedStudents.length) {
      res.status(404).json({
        success: false,
        message: "No students found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Students found",
        students: matchedStudents,
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

/**
 * Retrieves students enrolled in a specific subject
 * @async
 * @function getStudentsBySubject
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Subject ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with list of enrolled students
 * @throws {Error} If retrieval fails or no students found
 */
const getStudentsBySubject = async (req, res) => {
  try {
    const { id: subjectId } = req.params;
    const students = await Student.find({ subjects: subjectId });
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

/**
 * Retrieves all teachers in the system
 * @async
 * @function getAllTeachers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with list of teachers
 * @throws {Error} If retrieval fails or no teachers found
 */
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

/**
 * Searches for teachers based on a query string
 * @async
 * @function searchATeacher
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.searchQuery - Search term
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with matching teachers
 * @throws {Error} If search fails or no matches found
 */
const searchATeacher = async (req, res) => {
  try {
    const { searchQuery } = req.query;
    if (!searchQuery || searchQuery.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const matchedTeachers = await Teacher.find({
      $or: [
        { $text: { $search: searchQuery } },
        { email: { $regex: searchQuery, $options: "i" } },
        { teacherId: { $regex: searchQuery, $options: "i" } },
      ],
    });
    if (!matchedTeachers.length) {
      return res.status(404).json({
        success: false,
        message: "No teachers found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Teachers found",
      teachers: matchedTeachers,
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
 * Retrieves a specific student by ID
 * @async
 * @function getStudentsById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.studentId - Student ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with student details
 * @throws {Error} If student not found or retrieval fails
 */
const getStudentsById = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findOne({ studentId });
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

/**
 * Retrieves a specific teacher by ID
 * @async
 * @function getTeachersById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Teacher ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with teacher details
 * @throws {Error} If teacher not found or retrieval fails
 */
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

/**
 * Updates details of an existing teacher
 * @async
 * @function updateTeachersDetails
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Teacher ID
 * @param {Object} req.body - Request body containing updated details
 * @param {string} req.body.name - Updated teacher name
 * @param {string} req.body.email - Updated email
 * @param {string} req.body.password - Updated password
 * @param {string} req.body.contact - Updated contact number
 * @param {string} req.body.address - Updated address
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If update fails or teacher not found
 */
const updateTeachersDetails = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const {
      name,
      email,
      password,
      contact,
      alternateContact,
      address,
      profileImage,
      joiningYear,
      isVerified,
      role,
    } = req.body;

    // Validate teacher ID
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID format",
      });
    }

    // Fetch the current teacher record
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Prepare the fields to update
    const updateFields = {};

    // Validate and update name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }
      updateFields.name = name.trim();
    }

    // Validate and update email
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }
      // Check if email already exists (excluding current teacher)
      const existingTeacher = await Teacher.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: teacherId },
      });
      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      updateFields.email = email.toLowerCase().trim();
    }

    // Validate and update contact
    if (contact !== undefined) {
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(contact)) {
        return res.status(400).json({
          success: false,
          message: "Contact number must be a 10-digit number",
        });
      }
      updateFields.contact = contact.trim();
    }

    // Validate and update alternateContact
    if (alternateContact !== undefined) {
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(alternateContact)) {
        return res.status(400).json({
          success: false,
          message: "Alternate contact number must be a 10-digit number",
        });
      }
      updateFields.alternateContact = alternateContact.trim();
    }

    // Update address
    if (address !== undefined) {
      if (!address.trim()) {
        return res.status(400).json({
          success: false,
          message: "Address cannot be empty",
        });
      }
      updateFields.address = address.trim();
    }

    // Update profileImage
    if (profileImage !== undefined) {
      updateFields.profileImage = profileImage.trim();
    }

    // Validate and update joiningYear
    if (joiningYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (
        typeof joiningYear !== "number" ||
        joiningYear < 2000 ||
        joiningYear > currentYear + 1
      ) {
        return res.status(400).json({
          success: false,
          message: `Joining year must be between 2000 and ${currentYear + 1}`,
        });
      }
      updateFields.joiningYear = joiningYear;
    }

    // Update boolean fields
    if (isVerified !== undefined) {
      updateFields.isVerified = Boolean(isVerified);
    }
    if (role !== undefined) {
      updateFields.role = role;
    }

    // Handle password update
    if (password !== undefined) {
      if (!password.trim()) {
        return res.status(400).json({
          success: false,
          message: "Password cannot be empty",
        });
      }
      // Check if the provided password is plain text (not already hashed)
      if (password.length < 60) {
        const isSamePassword = await bcrypt.compare(password, teacher.password);
        if (isSamePassword) {
          return res.status(400).json({
            success: false,
            message: "Please enter a new password",
          });
        }
        const genSalt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(password, genSalt);
      } else {
        updateFields.password = password;
      }
    }

    // Add updatedAt timestamp
    updateFields.updatedAt = new Date();

    // Update the teacher record with new data
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");

    if (!updatedTeacher) {
      return res.status(400).json({
        success: false,
        message: "Failed to update teacher details",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher details updated successfully.",
      data: updatedTeacher,
    });
  } catch (e) {
    console.error("Error updating teacher details:", e);
    // Handle specific MongoDB errors
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating teacher details.",
    });
  }
};

/**
 * Deletes a teacher from the system
 * @async
 * @function deleteTeacher
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Teacher ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If deletion fails or teacher not found
 */
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

/**
 * Deletes a student from the system
 * @async
 * @function deleteStudent
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Student ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If deletion fails or student not found
 */
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

/**
 * Counts total number of students in the system
 * @async
 * @function countAllStudents
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with student count
 * @throws {Error} If count operation fails
 */
const countAllStudents = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    res.status(200).json({
      success: true,
      message: "Student count fetched successfully",
      studentCount: studentCount,
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
 * Counts total number of teachers in the system
 * @async
 * @function countAllTeachers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with teacher count
 * @throws {Error} If count operation fails
 */
const countAllTeachers = async (req, res) => {
  try {
    const teacherCount = await Teacher.countDocuments();
    res.status(200).json({
      success: true,
      message: "Teacher count fetched successfully",
      teacherCount: teacherCount,
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
 * Creates a new subject in the system
 * @async
 * @function createSubject
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing subject details
 * @param {string} req.body.name - Subject name
 * @param {string} req.body.code - Subject code
 * @param {string} req.body.category - Subject category
 * @param {string} req.body.duration - Course duration
 * @param {number} req.body.classesPerWeek - Number of classes per week
 * @param {string} req.body.gradeLevel - Grade level
 * @param {number} req.body.rating - Subject rating
 * @param {boolean} req.body.isPopular - Whether subject is popular
 * @param {string} req.body.description - Subject description
 * @param {string} req.body.imageUrl - Subject image URL
 * @param {Array<string>} req.body.teachers - Array of teacher IDs
 * @param {Array<string>} req.body.students - Array of student IDs
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If creation fails or subject already exists
 */
const createSubject = async (req, res) => {
  try {
    const {
      name,
      code,
      category,
      duration,
      classesPerWeek,
      gradeLevel,
      rating,
      isPopular,
      description,
      imageUrl,
      teachers,
      students,
    } = req.body;
    const existingSubject = await Subject.findOne({
      $or: [{ name: name }, { code: code }],
    });
    if (
      existingSubject &&
      (existingSubject.name === name || existingSubject.code === code)
    ) {
      res.status(400).json({
        success: false,
        message: "Subject already exists",
      });
    } else {
      const subject = new Subject({
        name,
        code,
        category,
        duration,
        classesPerWeek,
        gradeLevel,
        rating,
        isPopular,
        description,
        imageUrl,
        teachers,
        students,
      });
      const student = await Student.updateMany(
        {
          _id: { $in: students },
        },
        {
          $addToSet: { subjects: subject },
        }
      );
      const teacher = await Teacher.updateMany(
        {
          _id: { $in: teachers },
        },
        {
          $addToSet: { subjects: subject },
        }
      );
      await subject.save();
      res.status(200).json({
        success: true,
        message: "Subject added successfully",
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

/**
 * Updates an existing subject
 * @async
 * @function updateSubject
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Subject ID
 * @param {Object} req.body - Request body containing updated details
 * @param {string} req.body.name - Updated subject name
 * @param {string} req.body.code - Updated subject code
 * @param {string} req.body.category - Updated category
 * @param {string} req.body.duration - Updated duration
 * @param {number} req.body.classesPerWeek - Updated classes per week
 * @param {string} req.body.gradeLevel - Updated grade level
 * @param {number} req.body.rating - Updated rating
 * @param {boolean} req.body.isPopular - Updated popularity status
 * @param {string} req.body.description - Updated description
 * @param {string} req.body.imageUrl - Updated image URL
 * @param {Array<string>} req.body.teachers - Updated teacher IDs
 * @param {Array<string>} req.body.students - Updated student IDs
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If update fails or subject not found
 */
const updateSubject = async (req, res) => {
  try {
    let {
      name,
      code,
      category,
      duration,
      classesPerWeek,
      gradeLevel,
      rating,
      isPopular,
      description,
      imageUrl,
      teachers,
      students,
    } = req.body;
    const subjectId = req.params.id;
    if (!Array.isArray(students)) {
      students = [...students];
    }
    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      {
        name,
        code,
        category,
        duration,
        classesPerWeek,
        gradeLevel,
        rating,
        isPopular,
        description,
        imageUrl,
        $addToSet: {
          teachers: { $each: teachers },
          students: { $each: students },
        },
      },
      { new: true, runValidators: true }
    );
    const student = await Student.updateMany(
      { _id: { $in: students } },
      {
        $addToSet: { subjects: subject },
      },
      { new: true }
    );
    if (student.modifiedCount === 0) {
      console.log("no students were updated");
    } else {
      console.log("subjects added to students");
    }
    if (!subject) {
      res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Subject updated successfully",
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

/**
 * Retrieves all subjects in the system
 * @async
 * @function getAllSubjects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with list of subjects
 * @throws {Error} If retrieval fails or no subjects found
 */
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({}).populate(
      "students",
      "name studentId"
    );
    if (!subjects) {
      res.status(404).json({
        success: false,
        message: "Subjects not found, Please add new subject",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Subjects found successfully",
        subjects: subjects,
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

/**
 * Counts total number of subjects in the system
 * @async
 * @function countAllSubjects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with subject count
 * @throws {Error} If count operation fails
 */
const countAllSubjects = async (req, res) => {
  try {
    const subjectCount = await Subject.countDocuments();

    res.status(200).json({
      success: true,
      message: "Subjects count fetched successfully",
      subjectCount,
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
 * Deletes a subject from the system
 * @async
 * @function deleteSubject
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Subject ID
 * @param {Object} req.body - Request body
 * @param {Array<string>} req.body.studentIds - Array of student IDs to remove from subject
 * @param {Array<string>} req.body.teacherIds - Array of teacher IDs to remove from subject
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If deletion fails or subject not found
 */
const deleteSubject = async (req, res) => {
  try {
    const { id: subjectId } = req.params;
    let { studentIds, teacherIds } = req.body; // Expect studentIds & teacherIds in req.body

    // Ensure studentIds and teacherIds are arrays
    // if (!Array.isArray(studentIds) || !Array.isArray(teacherIds)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "studentIds and teacherIds must be arrays",
    //   });
    // }

    // Delete the subject
    const subject = await Subject.findByIdAndDelete(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Remove subjectId from students
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { $pull: { subjects: subjectId } }
    );

    // Remove subjectId from teachers
    await Teacher.updateMany(
      { _id: { $in: teacherIds } },
      { $pull: { subjects: subjectId } }
    );

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
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
 * Enrolls a student in one or more subjects
 * @async
 * @function enrollStudentInSubject
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.studentId - Student ID
 * @param {Object} req.query - Query parameters
 * @param {string|Array<string>} req.query.subjects - Subject ID(s) to enroll in
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If enrollment fails, student not found, or already enrolled
 */
const enrollStudentInSubject = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjects } = req.query;
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }
    const hasStudentTakenAdmission = await Student.findById(studentId);
    if (!hasStudentTakenAdmission.isAdmitted) {
      return res.status(400).json({
        success: false,
        message: "Student has not taken admission.",
      });
    }
    const subjectsArray = Array.isArray(subjects) ? subjects : [subjects];

    const isAlreadyEnrolled = subjectsArray.some((subject) =>
      existingStudent.subjects
        .map((c) => c.toString())
        .includes(subject.toString())
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in the subject",
      });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        $addToSet: { subjects: { $each: subjectsArray } },
      },
      { new: true, runValidators: true }
    );

    const addStudentToSubject = await Subject.findByIdAndUpdate(
      subjects,
      {
        $addToSet: { students: studentId },
      },
      { new: true, runValidators: true }
    );
    if (!addStudentToSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
      student,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Adds a teacher to one or more subjects
 * @async
 * @function addTeacherToSubject
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.teacherId - Teacher ID
 * @param {Object} req.query - Query parameters
 * @param {string|Array<string>} req.query.subjects - Subject ID(s) to add teacher to
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If addition fails, teacher not found, or already added
 */
const addTeacherToSubject = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjects } = req.query;
    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    } else {
      const subjectArray = Array.isArray(subjects) ? subjects : [subjects];

      const isAlreadyAdded = subjectArray.some((subject) =>
        existingTeacher.subjects
          .map((c) => c.toString())
          .includes(subject.toString())
      );
      if (isAlreadyAdded) {
        return res.status(400).json({
          success: false,
          message: "Teacher already added in the subject",
        });
      } else {
        const teacher = await Teacher.findByIdAndUpdate(
          teacherId,
          {
            $addToSet: { subjects: { $each: subjectArray } },
          },
          { new: true, runValidators: true }
        );
        return res.status(200).json({
          success: true,
          message: "Teacher added to subject successfully",
          teacher,
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
 * Removes a student from one or more subjects
 * @async
 * @function removeStudentFromSubject
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Subject ID
 * @param {Object} req.query - Query parameters
 * @param {string|Array<string>} req.query.studentIds - Student ID(s) to remove
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If removal fails or subject not found
 */
const removeStudentFromSubject = async (req, res) => {
  try {
    const { id: subjectId } = req.params;
    const { studentIds } = req.query;
    const studentArray = Array.isArray(studentIds) ? studentIds : [studentIds];
    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      {
        $pull: { students: { $in: studentArray } },
      },
      { new: true }
    );
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    } else {
      const students = await Student.updateMany(
        {
          _id: { $in: studentIds },
        },
        { $pull: { subjects: subjectId } },
        { new: true }
      ).lean();
      res.status(200).json({
        success: true,
        message: "Students removed from subject successfully",
        students,
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

/**
 * Removes a teacher from one or more subjects
 * @async
 * @function removeTeacherFromSubject
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Subject ID
 * @param {Object} req.body - Request body
 * @param {Array<string>} req.body.teacherIds - Teacher ID(s) to remove
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If removal fails or subject not found
 */
const removeTeacherFromSubject = async (req, res) => {
  try {
    const { id: subjectId } = req.params;
    const { teacherIds } = req.body;
    const teacher = await Subject.findByIdAndUpdate(
      subjectId,
      {
        $pull: { teachers: { $in: teacherIds } },
      },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    } else {
      const teachers = await Teacher.updateMany(
        { _id: { $in: teacherIds } },
        {
          $pull: { subjects: subjectId },
        },
        { new: true }
      );
      if (!teachers) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Teacher removed from subject successfully",
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
 * Marks attendance for a student in a subject
 * @async
 * @function markStudentAttendance
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.student - Student ID
 * @param {string} req.body.subject - Subject ID
 * @param {string} req.body.status - Attendance status (Present/Absent/Late)
 * @param {string} [req.body.note] - Optional note about attendance
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If marking fails, attendance already marked, or invalid data
 */
const markStudentAttendance = async (req, res) => {
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

    // Add attendance reference to the student document
    await Student.findByIdAndUpdate(
      student,
      { $addToSet: { attendance: attendance._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Attendance marked successfully.", attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Retrieves attendance records with pagination
 * @async
 * @function getAttendanceRecords
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number
 * @param {number} [req.query.limit=10] - Items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated attendance records
 * @throws {Error} If retrieval fails or no records found
 */
const getAttendanceRecords = async (req, res) => {
  try {
    const { page } = req.query;
    const { limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const attendance = await Attendance.find({})
      .skip(skip)
      .limit(limitNumber)
      .populate("student");
    const totalAttendance = await Attendance.countDocuments();
    const totalPages = Math.ceil(totalAttendance / limitNumber);
    if (!attendance || attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Attendance found",
        attendance,
        totalAttendance,
        totalPages,
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

/**
 * Retrieves students by attendance record
 * @async
 * @function getStudentByAttendance
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Attendance record ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with list of students
 * @throws {Error} If retrieval fails or no students found
 */
const getStudentByAttendance = async (req, res) => {
  try {
    const { id: attendanceId } = req.params;
    const students = await Student.find({ attendance: attendanceId });
    if (!students) {
      return res.status(404).json({
        success: false,
        message: "Students not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Students found",
        students,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Retrieves attendance records for a specific date
 * @async
 * @function getAttendanceByDate
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.date - Date to get attendance for (YYYY-MM-DD)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with attendance records
 * @throws {Error} If retrieval fails or no records found
 */
const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }
    const startOfDay = new Date(`${date}T00:00:00.000Z`); // Start of the day in UTC
    const endOfDay = new Date(`${date}T23:59:59.999Z`); // End of the day in UTC

    const attendanceExists = await Attendance.exists({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendanceExists) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    } else {
      const attendance = await Attendance.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).populate("student");
      return res.status(200).json({
        success: true,
        message: "Attendance found",
        attendance,
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

/**
 * Adds grades/scores for a student in a subject
 * @async
 * @function addGradesToStudent
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.studentId - Student ID
 * @param {string} req.body.subject - Subject ID
 * @param {string} req.body.examType - Type of exam (Midterm/Final/Quiz/Assignment)
 * @param {number} req.body.score - Score obtained
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If adding grades fails, student not found, or not enrolled
 */
const addGradesToStudent = async (req, res) => {
  try {
    const { studentId, subject, examType, score } = req.body;

    // Validate input
    if (!studentId || !subject || !examType || score === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (studentId, subject, examType, score) are required",
      });
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Check if student is enrolled in the given subject
    if (!student.subjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled in this subject",
      });
    }

    // Add the score to the student's scores array
    const addScores = new Score({
      studentId,
      subject,
      examType,
      score,
    });
    const addStudentScores = await Student.findByIdAndUpdate(
      studentId,
      {
        $addToSet: { scores: addScores },
      },
      { new: true, runValidators: true }
    );
    // Save the updated student record
    await addScores.save();

    return res.status(200).json({
      success: true,
      message: "Score added successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Updates a student's score for a subject
 * @async
 * @function updateStudentScore
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.studentId - Student ID
 * @param {string} req.params.subjectId - Subject ID
 * @param {string} req.params.examType - Type of exam
 * @param {Object} req.body - Request body
 * @param {number} req.body.score - Updated score
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated score
 * @throws {Error} If update fails, invalid IDs, or invalid exam type
 */
const updateStudentScore = async (req, res) => {
  try {
    const { studentId, subjectId, examType } = req.params;
    const { score, date, newExamType } = req.body;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(subjectId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student or subject ID" });
    }

    // Validate score
    if (typeof score !== "number" || isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Score must be a number between 0 and 100",
      });
    }

    // Validate exam type (use newExamType if provided, otherwise use the one from params)
    const examTypeToValidate = newExamType || examType;
    const validExamTypes = [
      "Midterm",
      "Final",
      "Quiz",
      "Assignment",
      "Board",
      "JEE",
      "NEET",
      "JEE Mains",
      "JEE Advanced",
      "MH CET",
      "NEET UG",
      "NEET UA",
      "NEET PG",
    ];
    if (!validExamTypes.includes(examTypeToValidate)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid exam type" });
    }

    // Validate date if provided
    let updateDate = undefined;
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }
      updateDate = parsedDate;
    }

    // Check student existence
    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Check subject enrollment
    if (!student.subjects.map(String).includes(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled in this subject",
      });
    }

    // Prepare update fields
    const updateFields = { score, updatedAt: Date.now() };
    if (updateDate) updateFields.date = updateDate;
    if (newExamType) updateFields.examType = newExamType;

    // Find and update the score
    const updatedScore = await Score.findOneAndUpdate(
      { studentId, subject: subjectId, examType },
      { $set: updateFields },
      { new: true, upsert: true }
    )
      .populate("subject", "name")
      .populate("studentId", "name studentId");

    if (!updatedScore) {
      return res.status(404).json({
        success: false,
        message: "Score not found or could not be updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student score updated successfully",
      updatedScore,
    });
  } catch (err) {
    console.error("Error in updateStudentScore:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteStudentScore = async (req, res) => {
  try {
    const { studentId, subjectId, examType } = req.params;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(subjectId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student or subject ID",
      });
    }

    // Check if the score exists
    const score = await Score.findOne({
      studentId,
      subject: subjectId,
      examType,
    });

    if (!score) {
      return res.status(404).json({
        success: false,
        message: "Score not found",
      });
    }

    // Delete the score
    await Score.deleteOne({ _id: score._id });
    // Remove the score reference from the student
    // Update the student to remove the score reference
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $pull: { scores: score._id } },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    // Remove the score from the subject
    return res.status(200).json({
      success: true,
      message: "Student score deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteStudentScore:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Retrieves scores for a specific student
 * @async
 * @function getStudentScore
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.studentId - Student ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with student's scores
 * @throws {Error} If retrieval fails or student not found
 */
const getStudentScore = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentName = await Student.findById(studentId).select("name");
    if (!studentName) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    } else {
      const scores = await Score.find({ studentId }).populate(
        "subject",
        "name"
      );
      if (!scores || scores.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No scores found for student",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Student score found successfully",
          studentName,
          scores,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Retrieves scores for a specific subject
 * @async
 * @function getScoresForSubject
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.subjectId - Subject ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with subject scores
 * @throws {Error} If retrieval fails or no scores found
 */
const getScoresForSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const scores = await Score.find({ subject: subjectId })
      .populate("subject", "name")
      .populate("studentId", "name");
    if (!scores || scores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No scores found for subject",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Subject score found successfully",
        scores,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * Creates a new batch in the system
 * @async
 * @function createBatch
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Batch name
 * @param {string} req.body.classStd - Class/Standard
 * @param {string} req.body.timings - Batch timings
 * @param {string} req.body.subjectId - Subject ID
 * @param {string} req.body.teacherId - Teacher ID
 * @param {Array<string>} [req.body.studentIds] - Array of student IDs
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created batch
 * @throws {Error} If creation fails or batch already exists
 */
const createBatch = async (req, res) => {
  try {
    const { name, classStd, timings, subjectId, teacherId, studentIds } =
      req.body;
    if (!name || !classStd || !timings || !subjectId || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Check if the batch already exists
    const existingBatch = await Batch.findOne({
      name,
      classStd,
      timings,
      subjectId,
    });
    if (existingBatch) {
      return res.status(400).json({
        success: false,
        message: "Batch already exists",
      });
    }
    const batch = new Batch({
      name,
      classStd,
      timings,
      subjectId,
      teacherId,
      studentIds,
    });
    await batch.save();
    if (!batch) {
      return res.status(400).json({
        success: false,
        message: "Batch not created! please try again later",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Batch created successfully",
        batch,
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

/**
 * Updates an existing batch
 * @async
 * @function updateBatch
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Batch ID
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Updated batch name
 * @param {string} req.body.classStd - Updated class/standard
 * @param {string} req.body.timings - Updated timings
 * @param {string} req.body.subjectId - Updated subject ID
 * @param {string} req.body.teacherId - Updated teacher ID
 * @param {Array<string>} req.body.studentIds - Updated student IDs
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated batch
 * @throws {Error} If update fails or batch not found
 */
const updateBatch = async (req, res) => {
  try {
    const batchId = req.params.id;
    const { name, classStd, timings, subjectId, teacherId, studentIds } =
      req.body;
    if (!name || !classStd || !timings || !subjectId || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const batch = await Batch.findByIdAndUpdate(
      batchId,
      {
        name,
        classStd,
        timings,
        subjectId,
        teacherId,
        studentIds,
      },
      { new: true, runValidators: true }
    );
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Batch updated successfully",
        batch,
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

/**
 * Retrieves all batches in the system
 * @async
 * @function getAllBatches
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with list of batches
 * @throws {Error} If retrieval fails or no batches found
 */
const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find({}).populate(
      "subjectId teacherId studentIds"
    );
    if (!batches) {
      return res.status(404).json({
        success: false,
        message: "No batches found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Batches found successfully",
        batches,
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

/**
 * Adds a student to a batch
 * @async
 * @function addStudentToBatch
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Student ID
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.batchId - Batch ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If addition fails, student/batch not found, or already in batch
 */
const addStudentToBatch = async (req, res) => {
  try {
    const studentId = req.params.id; // Fix extraction of studentId
    const batchId = req.query.batchId;

    // Check if student exists
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if batch exists
    const batchExists = await Batch.findById(batchId);
    if (!batchExists) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }
    if (!existingStudent.subjects.includes(batchExists.subjectId)) {
      return res.status(400).json({
        success: false,
        message: `Student is not enrolled in the subject for batch ${batchExists.batchId}`,
      });
    }
    if (existingStudent.batches.includes(batchId)) {
      // Check if student is already in the batch
      return res.status(400).json({
        success: false,
        message: `Student already in batch ${batchExists.batchId}`,
      });
    }

    // Add student to batch
    const batch = await Batch.findByIdAndUpdate(
      batchId,
      { $addToSet: { studentIds: studentId } },
      { new: true, runValidators: true }
    );
    if (!batch) {
      return res.status(400).json({
        success: false,
        message: "Error adding student to batch",
      });
    }

    // Add batch to student
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $addToSet: { batches: batchId } },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Error adding batch to student",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Student added to batch ${batchExists.batchId}!`,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

/**
 * Adds a teacher to a batch
 * @async
 * @function addTeacherToBatch
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Teacher ID
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.batchId - Batch ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If addition fails, teacher/batch/subject not found, or not teaching subject
 */
const addTeacherToBatch = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const batchId = req.query.batchId;

    const existingTeacher = await Teacher.findById(teacherId); // FIXED
    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    const subject = await Subject.findById(batch.subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const teacherTeachesSubject = existingTeacher.subjects.includes(
      subject._id
    );
    if (!teacherTeachesSubject) {
      return res.status(400).json({
        success: false,
        message: `${existingTeacher.name} does not teach the subject ${subject.name}`,
      });
    }

    // ✅ Add teacher ID to batch
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { $addToSet: { teachers: teacherId } },
      { new: true, runValidators: true }
    );

    if (!updatedBatch) {
      return res.status(400).json({
        success: false,
        message: "Teacher not added to batch",
      });
    }

    // ✅ Add batch ID to teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $addToSet: { batches: batchId } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Teacher added successfully to batch",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

/**
 * Removes a student from a batch
 * @async
 * @function removeStudentFromBatch
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Student ID
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.batchId - Batch ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If removal fails, student/batch not found, or not in batch
 */
const removeStudentFromBatch = async (req, res) => {
  try {
    const studentId = req.params.id;
    const batchId = req.query.batchId;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }
    const isStudentInBatch = student.batches.includes(batch._id);
    if (!isStudentInBatch) {
      return res.status(400).json({
        success: false,
        message: `Student ${student.name} is not in the batch ${batch.batchId}`,
      });
    }
    const removeStudentFromBatch = await Batch.findByIdAndDelete(
      batchId,
      {
        $pull: { studentId: student._id },
      },
      { new: true, runValidators: true }
    );
    await removeStudentFromBatch.save();
    const removeBatchFromStudent = await Student.findByIdAndDelete(
      studentId,
      {
        $pull: { batches: batch._id },
      },
      { new: true, runValidators: true }
    );
    await removeBatchFromStudent.save();
    return res.status(200).json({
      success: true,
      message: "Student removed successfully from batch",
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
 * Removes a teacher from a batch
 * @async
 * @function removeTeacherFromBatch
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Teacher ID
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.batchId - Batch ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 * @throws {Error} If removal fails, teacher/batch not found, or not in batch
 */
const removeTeacherFromBatch = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const batchId = req.query.batchId;
    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }
    const isTeacherInTheBatch = existingTeacher.batches.includes(batch._id);
    if (!isTeacherInTheBatch) {
      return res.status(400).json({
        success: false,
        message: `${existingTeacher.name} does not teach the batch ${batch.batchId}`,
      });
    }
    const removeTeacherFromTheBatch = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        $pull: { batches: batch._id },
      },
      { new: true, runValidators: true }
    );
    await removeTeacherFromTheBatch.save();
    const removeBatchFromTeacher = await Batch.findByIdAndUpdate(
      batch._id,
      {
        $pull: { teacherId: existingTeacher._id },
      },
      { new: true, runValidators: true }
    );
    await removeBatchFromTeacher.save();
    return res.status(200).json({
      success: true,
      message: `Teacher ${existingTeacher.name} successfully removed from batch ${batch.batchId}`,
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
 * Updates a student's attendance record
 * @async
 * @function updateStudentAttendance
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.studentId - Student ID
 * @param {string} req.params.attendanceId - Attendance record ID
 * @param {Object} req.body - Request body
 * @param {string} req.body.status - New attendance status
 * @param {string} [req.body.note] - Optional note about attendance
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated attendance record
 */
const updateStudentAttendance = async (req, res) => {
  try {
    const { studentId, attendanceId } = req.params;
    const { status, note } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required for updating attendance",
      });
    }

    // Find and validate student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Find and validate attendance record
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Verify the attendance record belongs to the student
    if (attendance.student.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message:
          "This attendance record does not belong to the specified student",
      });
    }

    // Update the attendance record
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      {
        status,
        note: note || attendance.note,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedAttendance) {
      return res.status(400).json({
        success: false,
        message: "Failed to update attendance record",
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

/**
 * Retrieves students with server-side filtering and pagination
 * @async
 * @function getFilteredStudents
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number
 * @param {number} [req.query.limit=10] - Items per page
 * @param {string} [req.query.batchId] - Batch ID to filter
 * @param {string} [req.query.status] - Attendance status to filter (Present/Absent/Late)
 * @param {string} [req.query.search] - Search term (name, email, studentId)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated, filtered students
 */
const getFilteredStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, batchId, status, search } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    let filter = {};

    // Batch filter
    if (batchId && batchId !== "All Batches") {
      filter.batches = batchId;
    }

    // Search filter
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { studentId: regex }];
    }

    // Find students
    let students = await Student.find(filter)
      .populate("subjects")
      .populate("batches")
      .populate("attendance")
      .populate({
        path: "scores",
        populate: { path: "subject" },
      });

    // Status filter (on latest attendance)
    if (status && status !== "all") {
      students = students.filter((student) => {
        const lastAttendance =
          Array.isArray(student.attendance) && student.attendance.length > 0
            ? student.attendance[student.attendance.length - 1]
            : null;
        return lastAttendance?.status === status;
      });
    }

    const total = students.length;
    const paginatedStudents = students.slice(skip, skip + limitNumber);

    res.status(200).json({
      success: true,
      students: paginatedStudents,
      total,
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
 * Retrieves attendance stats for a batch and date
 * @async
 * @function getAttendanceStats
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.batchId - Batch ID to filter
 * @param {string} req.query.date - Date (YYYY-MM-DD)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with present, absent, late, and monthlyAvg
 */
const getAttendanceStats = async (req, res) => {
  try {
    const { batchId, date } = req.query;
    if (!batchId || !date) {
      return res.status(400).json({
        success: false,
        message: "batchId and date are required",
      });
    }
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    // Find students in batch
    const students = await Student.find({ batches: batchId });
    const studentIds = students.map((s) => s._id);
    // Find attendance for those students on the date
    const attendance = await Attendance.find({
      student: { $in: studentIds },
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    let present = 0,
      absent = 0,
      late = 0;
    attendance.forEach((a) => {
      if (a.status === "Present") present++;
      else if (a.status === "Absent") absent++;
      else if (a.status === "Late") late++;
    });
    // Monthly average (for simplicity, use attendance in last 30 days)
    const monthAgo = new Date(startOfDay);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthlyAttendance = await Attendance.find({
      student: { $in: studentIds },
      date: { $gte: monthAgo, $lte: endOfDay },
    });
    const monthlyPresent = monthlyAttendance.filter(
      (a) => a.status === "Present" || a.status === "Late"
    ).length;
    const monthlyAvg =
      students.length > 0 ? (monthlyPresent / (students.length * 30)) * 100 : 0;
    res.status(200).json({
      success: true,
      present,
      absent,
      late,
      monthlyAvg: Number(monthlyAvg.toFixed(1)),
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
 * Retrieves attendance records with filtering and pagination
 * @async
 * @function getFilteredAttendanceRecords
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.batchId] - Batch ID to filter
 * @param {string} [req.query.date] - Date (YYYY-MM-DD)
 * @param {string} [req.query.status] - Attendance status to filter
 * @param {number} [req.query.page=1] - Page number
 * @param {number} [req.query.limit=10] - Items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated, filtered attendance records
 */
const getFilteredAttendanceRecords = async (req, res) => {
  try {
    const { batchId, date, status, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    let filter = {};
    // Batch filter
    if (batchId && batchId !== "All Batches") {
      // Find students in batch
      const students = await Student.find({ batches: batchId });
      const studentIds = students.map((s) => s._id);
      filter.student = { $in: studentIds };
    }
    // Date filter
    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }
    // Status filter
    if (status && status !== "all") {
      filter.status = status;
    }
    const total = await Attendance.countDocuments(filter);
    const attendance = await Attendance.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .populate("student")
      .populate("subject");
    res.status(200).json({
      success: true,
      attendance,
      total,
    });
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
  generateNewRefreshAccessToken,
  adminLogout,
  getAdminDetails,
  updateAdminDetails,
  createStudents,
  updateStudentDetails,
  getAllStudents,
  getAllStudentsWithPagination,
  searchAStudent,
  searchATeacher,
  getStudentsBySubject,
  getAllTeachers,
  getStudentsById,
  getTeachersById,
  updateTeachersDetails,
  countAllStudents,
  countAllTeachers,
  deleteTeacher,
  deleteStudent,
  createSubject,
  updateSubject,
  getAllSubjects,
  countAllSubjects,
  deleteSubject,
  enrollStudentInSubject,
  removeStudentFromSubject,
  addTeacherToSubject,
  removeTeacherFromSubject,
  markStudentAttendance,
  getAttendanceRecords,
  getStudentByAttendance,
  getAttendanceByDate,
  addGradesToStudent,
  updateStudentScore,
  deleteStudentScore,
  getStudentScore,
  getScoresForSubject,
  createBatch,
  updateBatch,
  getAllBatches,
  addStudentToBatch,
  addTeacherToBatch,
  removeStudentFromBatch,
  removeTeacherFromBatch,
  updateStudentAttendance,
  getFilteredStudents,
  getAttendanceStats,
  getFilteredAttendanceRecords,
  resendVerificationEmailAdmin,
};
