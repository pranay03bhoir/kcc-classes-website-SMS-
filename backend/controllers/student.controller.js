const joi = require("joi");
const Student = require("../models/student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/email");

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

const studentLogout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(204).send();
    }
    await Student.updateOne(
      { refreshToken: refreshToken },
      { $unset: { refreshToken: "" } }
    );
    const cookiesToClear = ["accessToken", "refreshToken"];
    cookiesToClear.forEach((cookie) => {
      res.clearCookie(cookie, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: "Lax",
        expires: new Date(0),
      });
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
const getStudentDetails = async (req, res) => {
  try {
    const studentId = req.userInfo.id;
    const student = await Student.findById(studentId)
      .select(
        "studentId name email contact parentsContact address currentStd admissionYear profileImage batches scores subjects"
      )
      .populate(
        "subjects",
        "name code description teachers category duration gradeLevel"
      )
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (e) {
    console.error("Error in getStudentDetails:", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.userInfo.id;
    const { name, password, contact, parentsContact, address, profileImage } =
      req.body;

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
};
