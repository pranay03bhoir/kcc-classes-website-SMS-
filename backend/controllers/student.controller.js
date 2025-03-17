const Student = require("../models/student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentRegister = async (req, res) => {
  try {
    const { name, email, password, contact, parentsContact, address } =
      req.body;
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
    const { email, password, rememberMe } = req.body;
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
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "PRODUCTION",
          sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Lax" : "None",
          maxAge: 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "PRODUCTION",
          sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Lax" : "None",
          maxAge: cookieExpiration,
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
            message: "Invalid token or Expired token",
          });
        }
        const newAccessToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );
        const newRefreshToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "30d" },
        );
        student.refreshToken = newRefreshToken;
        await student.save();
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
      },
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
      { $unset: { refreshToken: "" } },
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
      },
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
const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.userInfo.id;
    const student = await Student.findById(studentId)
      .select("name email")
      .populate("courses", "name description");
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
  studentLogin,
  generateNewRefreshAccessToken,
  studentLogout,
  updateStudentProfile,
  getStudentCourses,
};
