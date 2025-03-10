const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Course = require("../models/course.model");
const Attendance = require("../models/attendance.model");
const Score = require("../models/score.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
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
        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "PRODUCTION",
          sameSite: "None",
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
    const students = await Student.find({}).populate("courses");
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
const getStudentsByCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const students = await Student.find({ courses: courseId });
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
    const {
      name,
      email,
      password,
      contact,
      address,
      courses,
      attendance,
      scores,
    } = req.body;
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        name: name,
        email: email,
        password: password,
        contact: contact,
        address: address,
        courses: courses,
        attendance: attendance,
        scores: scores,
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
const createCourse = async (req, res) => {
  try {
    const { name, code, teachers, students } = req.body;
    const existingCourse = await Course.findOne({
      $or: [{ name: name }, { code: code }],
    });
    if (
      existingCourse &&
      (existingCourse.name === name || existingCourse.code === code)
    ) {
      res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    } else {
      const course = new Course({
        name,
        code,
        teachers,
        students,
      });
      const student = await Student.updateMany(
        {
          _id: { $in: students },
        },
        {
          $addToSet: { courses: course },
        },
      );
      const teacher = await Teacher.updateMany(
        {
          _id: { $in: teachers },
        },
        {
          $addToSet: { courses: course },
        },
      );
      await course.save();
      res.status(200).json({
        success: true,
        message: "Course added successfully",
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
const updateCourse = async (req, res) => {
  try {
    let { name, code, teachers, students } = req.body;
    const courseId = req.params.id;
    if (!Array.isArray(students)) {
      students = [...students];
    }
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        name: name,
        code: code,
        $addToSet: {
          teachers: { $each: teachers },
          students: { $each: students },
        },
      },
      { new: true, runValidators: true },
    );
    const student = await Student.updateMany(
      { _id: { $in: students } },
      {
        $addToSet: { courses: course },
      },
      { new: true },
    );
    if (student.modifiedCount === 0) {
      console.log("no students were updated");
    } else {
      console.log("courses added to students");
    }
    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Course updated successfully",
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
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    if (!courses) {
      res.status(404).json({
        success: false,
        message: "Courses not found, Please add new course",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Courses found successfully",
        courses: courses,
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
const deleteCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    let { studentIds, teacherIds } = req.body; // Expect studentIds & teacherIds in req.body

    // Ensure studentIds and teacherIds are arrays
    // if (!Array.isArray(studentIds) || !Array.isArray(teacherIds)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "studentIds and teacherIds must be arrays",
    //   });
    // }

    // Delete the course
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Remove courseId from students
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { $pull: { courses: courseId } },
    );

    // Remove courseId from teachers
    await Teacher.updateMany(
      { _id: { $in: teacherIds } },
      { $pull: { courses: courseId } },
    );

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const enrollStudentInCourse = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courses } = req.body;
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const coursesArray = Array.isArray(courses) ? courses : [courses];

    const isAlreadyEnrolled = coursesArray.some((course) =>
      existingStudent.courses
        .map((c) => c.toString())
        .includes(course.toString()),
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in the course",
      });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        $addToSet: { courses: { $each: coursesArray } },
      },
      { new: true, runValidators: true },
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
const addTeacherToCourse = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { courses } = req.body;
    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    } else {
      const courseArray = Array.isArray(courses) ? courses : [courses];

      const isAlreadyAdded = courseArray.some((course) =>
        existingTeacher.courses
          .map((c) => c.toString())
          .includes(course.toString()),
      );
      if (isAlreadyAdded) {
        return res.status(400).json({
          success: false,
          message: "Teacher already added in the course",
        });
      } else {
        const teacher = await Teacher.findByIdAndUpdate(
          teacherId,
          {
            $addToSet: { courses: { $each: courseArray } },
          },
          { new: true, runValidators: true },
        );
        return res.status(200).json({
          success: true,
          message: "Teacher added to course successfully",
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
const removeStudentFromCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { studentIds } = req.body;
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: { students: { $in: studentIds } },
      },
      { new: true },
    );
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    } else {
      const students = await Student.updateMany(
        {
          _id: { $in: studentIds },
        },
        { $pull: { courses: courseId } },
        { new: true },
      ).lean();
      res.status(200).json({
        success: true,
        message: "Students removed from course successfully",
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
const removeTeacherFromCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { teacherIds } = req.body;
    const teacher = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: { teachers: { $in: teacherIds } },
      },
      { new: true },
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
          $pull: { courses: courseId },
        },
        { new: true },
      );
      if (!teachers) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Teacher removed from course successfully",
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
    const { student, course, status } = req.body;
    const attendance = new Attendance({
      student,
      course,
      status,
    });
    const studentAttendance = await Student.findByIdAndUpdate(
      student,
      {
        $addToSet: { attendance: attendance },
      },
      { new: true },
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
    const { studentId, course, examType, score } = req.body;

    // Validate input
    if (!studentId || !course || !examType || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields (studentId, course, examType, score) are required",
      });
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Check if student is enrolled in the given course
    if (!student.courses.includes(course)) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    // Add the score to the student's scores array
    const addScores = new Score({
      studentId,
      course,
      examType,
      score,
    });
    const addStudentScores = await Student.findByIdAndUpdate(
      studentId,
      {
        $addToSet: { scores: addScores },
      },
      { new: true, runValidators: true },
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
    const { studentId, courseId, examType } = req.params;
    const { score } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student or course ID" });
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
      { studentId, course: courseId, examType },
      { $set: { score, updatedAt: Date.now() } },
      { new: true, upsert: true },
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
      const scores = await Score.find({ studentId }).populate("course", "name");
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
const getScoresForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const scores = await Score.find({ course: courseId })
      .populate("course", "name")
      .populate("studentId", "name");
    if (!scores || scores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No scores found for course",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Course score found successfully",
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
module.exports = {
  adminRegister,
  adminLogin,
  adminLogout,
  getAllStudents,
  getStudentsByCourse,
  getAllTeachers,
  getStudentsById,
  getTeachersById,
  updateTeachersDetails,
  updateStudentsDetails,
  deleteTeacher,
  deleteStudent,
  createCourse,
  updateCourse,
  getAllCourses,
  deleteCourse,
  enrollStudentInCourse,
  removeStudentFromCourse,
  addTeacherToCourse,
  removeTeacherFromCourse,
  markStudentAttendance,
  getAttendanceRecords,
  getStudentByAttendance,
  getAttendanceByDate,
  addGradesToStudent,
  updateStudentScore,
  getStudentScore,
  getScoresForCourse,
};
