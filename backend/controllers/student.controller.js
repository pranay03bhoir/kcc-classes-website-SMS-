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
const studentLogout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "Lax",
      expires: new Date(0),
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

module.exports = {
  studentRegister,
  studentLogin,
  studentLogout,
  updateStudentProfile,
};
