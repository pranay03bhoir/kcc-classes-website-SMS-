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
const { sendVerificationEmail } = require("../utils/email.js");
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
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid token or Expired token",
        });
      }
      const payload = {
        id: user._id,
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
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Lax" : "None",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Lax" : "None",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      return res.status(200).json({
        success: true,
        message: "New access token generated",
        accessToken: newAccessToken,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
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
    } = req.body;
    const existingStudent = await Student.findOne({ email: email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Student with email ${email} already exists.Kindly login`,
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
      message: "Something went wrong",
    });
  }
};
const updateStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      name,
      password,
      contact,
      parentsContact,
      address,
      profileImage,
      admissionYear,
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
    const updateFields = {};

    // Only update fields if they are provided in the request
    if (name) updateFields.name = name;
    if (contact) updateFields.contact = contact;
    if (parentsContact) updateFields.parentsContact = parentsContact;
    if (address) updateFields.address = address;
    if (profileImage) updateFields.profileImage = profileImage;
    if (admissionYear) updateFields.admissionYear = admissionYear;

    // If a new password is provided, handle hashing it
    if (password) {
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
// const removeStudent = async (req, res) => {
//   try {
//     const studentId = req.params.id;
//     const student = await Student.findByIdAndDelete(studentId);
//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Student deleted successfully",
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).populate("subjects");
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
    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    const { name, email, password, contact, address } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        name: name,
        email: email,
        password: hashedPassword,
        contact: contact,
        address: address,
      },
      { new: true, runValidators: true }
    );
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher details update failed",
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
// const updateStudentsDetails = async (req, res) => {
//   try {
//     const studentId = req.params.id;
//     const existingStudent = await Student.findById(studentId);
//     if (!existingStudent) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }
//     const {
//       name,
//       email,
//       password,
//       contact,
//       address,
//       subjects,
//       attendance,
//       scores,
//     } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const student = await Student.findByIdAndUpdate(
//       studentId,
//       {
//         name: name,
//         email: email,
//         password: hashedPassword,
//         contact: contact,
//         address: address,
//         subjects: subjects,
//         attendance: attendance,
//         scores: scores,
//       },
//       { new: true, runValidators: true }
//     );
//     if (!student) {
//       res.status(404).json({
//         success: false,
//         message: "Student update failed",
//       });
//     } else {
//       res.status(200).json({
//         success: true,
//         message: "Student details updated",
//       });
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };
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
const addTeacherToSubject = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subjects } = req.body;
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
const removeStudentFromSubject = async (req, res) => {
  try {
    const { id: subjectId } = req.params;
    const { studentIds } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      {
        $pull: { students: { $in: studentIds } },
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
const markStudentAttendance = async (req, res) => {
  try {
    const { student, subject, status } = req.body;
    const attendance = new Attendance({
      student,
      subject,
      status,
    });
    const studentAttendance = await Student.findByIdAndUpdate(
      student,
      {
        $addToSet: { attendance: attendance },
      },
      { new: true }
    );
    await attendance.save();
    return res.status(200).json({
      success: true,
      message: "Student attendance added successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getAttendanceRecords = async (req, res) => {
  try {
    const attendance = await Attendance.find({}).populate("student");
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    } else {
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
const updateStudentScore = async (req, res) => {
  try {
    const { studentId, subjectId, examType } = req.params;
    const { score } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(subjectId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student or subject ID" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const validExamTypes = ["Midterm", "Final", "Quiz", "Assignment"];
    if (!validExamTypes.includes(examType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid exam type" });
    }

    const updatedScore = await Score.findOneAndUpdate(
      { studentId, subject: subjectId, examType },
      { $set: { score, updatedAt: Date.now() } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Student score updated successfully",
      updatedScore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
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
const createBatch = async (req, res) => {
  try {
    const { name, classStd, timings, subjectId, teacherId, studentIds } =
      req.body;
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
const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find({}).populate(
      "subjectId teacherId studentIds",
      "name"
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
const addTeacherToBatch = async (req, res) => {
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
        message: `${existingTeacher.name} does not teach for the subject ${subject.name}`,
      });
    }
    const addTeacherInSubject = await Batch.findByIdAndUpdate(
      batchId,
      existingTeacher,
      {
        new: true,
        runValidators: true,
      }
    );
    await addTeacherInSubject.save();
    if (!addTeacherInSubject) {
      return res.status(400).json({
        success: false,
        message: "Teacher not added to batch",
      });
    }
    const addBatchToTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        $addToSet: { batches: batch },
      },
      { new: true, runValidators: true }
    );
    await addBatchToTeacher.save();
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
module.exports = {
  adminRegister,
  adminLogin,
  generateNewRefreshAccessToken,
  adminLogout,
  createStudents,
  updateStudentDetails,
  getAllStudents,
  searchAStudent,
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
  getStudentScore,
  getScoresForSubject,
  createBatch,
  getAllBatches,
  addStudentToBatch,
  addTeacherToBatch,
  removeStudentFromBatch,
  removeTeacherFromBatch,
};
