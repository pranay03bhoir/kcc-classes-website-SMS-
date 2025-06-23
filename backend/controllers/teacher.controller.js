/* The above code is a collection of functions written in JavaScript for a teacher management system.
Here is a summary of what each function does: */
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
  oldPassword: joi.string().min(8),
  contact: joi.string().min(10).max(13).required(),
  alternateContact: joi.string().min(10).max(13).required(),
  address: joi.string().required(),
});
// Joi schema for updating teacher details (all fields optional)
const teacherUpdateSchema = joi.object({
  name: joi.string(),
  email: joi.string().email(),
  contact: joi.string().min(10).max(13),
  alternateContact: joi.string().min(10).max(13),
  address: joi.string(),
  profileImage: joi.string(),
  oldPassword: joi.string().min(8),
  password: joi.string().min(8),
});
/**
 * The provided code snippet includes various asynchronous functions for handling teacher registration,
 * verification, login, logout, student-related operations, attendance management, and batch retrieval,
 * along with a function to get teacher details.
 * @param req - `req` stands for the request object, which contains information sent by the client to
 * the server. It includes parameters, body, headers, and other details needed to process the request.
 * The request object is used to access data sent by the client to the server.
 * @param res - `res` is the response object that is used to send back the response to the client
 * making the request. It is typically used to set the status code, send JSON data, or render a view in
 * response to the client's request. It allows you to communicate back to the client making the request
 * @returns The code snippets provided include various functions related to teacher and student
 * management in an educational system. Here is a summary of the functions and their purposes:
 */
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
/**
 * The function `teacherLogin` handles the login process for teachers, including verifying credentials,
 * generating access and refresh tokens, setting cookies, and returning appropriate responses.
 * @param req - `req` is the request object that contains information about the HTTP request made by
 * the client to the server. It includes data such as headers, parameters, body, and more. In this
 * specific function `teacherLogin`, `req` is used to access the data sent in the request body, which
 * @param res - The `res` parameter in the `teacherLogin` function is the response object that will be
 * used to send responses back to the client making the request. It is typically used to send HTTP
 * responses with status codes, headers, and data.
 * @returns The `teacherLogin` function returns a JSON response with different messages based on the
 * outcome of the login process. Here are the possible return scenarios:
 */
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
/**
 * The function generates new access and refresh tokens for a teacher based on the provided refresh
 * token.
 * @param req - `req` is the request object representing the HTTP request made by the client to the
 * server. It contains information about the request such as headers, parameters, body, cookies, etc.
 * In this context, `req` is used to access the cookies sent in the request, specifically the
 * `refreshToken
 * @param res - The `res` parameter in the `generateNewAccessRefreshToken` function is the response
 * object that will be used to send responses back to the client making the request. It is typically an
 * instance of the Express response object in Node.js applications. This object allows you to send HTTP
 * responses with data,
 * @returns The `generateNewAccessRefreshToken` function returns a response with a new access token
 * generated for the user. The response includes a success status, a message indicating that a new
 * access token has been generated, and the new access token itself.
 */
const generateNewAccessRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
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
      });
    }
  );
};
/**
 * The function `teacherLogout` handles the logout process for a teacher, clearing cookies and updating
 * the database to remove the refresh token.
 * @param req - The `req` parameter in the `teacherLogout` function is an object representing the HTTP
 * request. It contains information about the request made by the client, such as headers, parameters,
 * cookies, and body data. In this function, `req.cookies` is used to access cookies sent by the client
 * @param res - The `res` parameter in the `teacherLogout` function is the response object that will be
 * sent back to the client making the request. It is used to send a response back to the client with
 * the appropriate status code, headers, and data. In this function, the `res` object is
 * @returns If the `refreshToken` is not found in the request cookies, a status of 203 is returned with
 * no content. If the `refreshToken` is found and the update operation is successful, a status of 200
 * is returned with a JSON response indicating success and a message that the teacher has been logged
 * out. If an error occurs during the process, a status of 500 is returned with
 */
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

/**
 * The function `getAllStudents` retrieves all student data including their subjects, attendance, and
 * batches from the database and returns a response with the retrieved students if successful.
 * @param req - The `req` parameter in the `getAllStudents` function stands for the request object. It
 * contains information about the HTTP request that triggered the function, such as request headers,
 * parameters, body, and other details. The `req` parameter is typically provided by the Express.js
 * framework when handling HTTP requests
 * @param res - The `res` parameter in the `getAllStudents` function is the response object that will
 * be used to send the response back to the client making the request. It is typically an instance of
 * the Express response object that allows you to send HTTP responses with data, status codes, and
 * headers.
 * @returns If there are students found in the database, a success response with status code 200 will
 * be returned along with a message "Students retrieved successfully" and the array of student objects.
 * If no students are found, a response with status code 404 will be returned with a message "No
 * students found". If there is an error during the process, a response with status code 500 will be
 * returned with
 */
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
/**
 * The function `getStudentById` retrieves a student's information by their ID and returns it in a JSON
 * response.
 * @param req - `req` is the request object representing the HTTP request made by the client to the
 * server. It contains information about the request such as the URL, headers, parameters, body
 * content, etc. In this specific function `getStudentById`, `req.params` is used to extract the
 * `studentId
 * @param res - The `res` parameter in the `getStudentById` function is the response object that will
 * be used to send the response back to the client making the request. It is typically an instance of
 * the Express response object that allows you to send HTTP responses with data such as status codes,
 * headers, and
 * @returns If the student is successfully retrieved, a JSON response with a status code of 200 will be
 * returned containing the success status, a message indicating the successful retrieval of the
 * student, and the student object.
 */
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
/**
 * The function `updateStudentDetails` updates student details based on the provided fields in the
 * request and returns a success message with the updated student data or an error message if something
 * goes wrong.
 * @param req - The `req` parameter in the `updateStudentDetails` function stands for the request
 * object. It contains information about the HTTP request made to the server, including the request
 * parameters, body, headers, and other details. In this function, `req` is used to extract the student
 * ID from the
 * @param res - The `res` parameter in the `updateStudentDetails` function is the response object that
 * will be used to send back the response to the client making the request. It is typically used to set
 * the status code, send JSON data, or render a view in response to the client's request.
 * @returns The `updateStudentDetails` function returns a JSON response with the following structure:
 */
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
/**
 * The function `addStudentAttendance` handles marking attendance for a student in a specific subject,
 * ensuring no duplicate records for the same day, and updating the student's attendance array
 * accordingly.
 * @param req - The `req` parameter in the `addStudentAttendance` function stands for the request
 * object. It contains information about the HTTP request that triggered the function, including
 * headers, parameters, body, and more. In this case, the function is expecting the request body to
 * contain data about the student, subject
 * @param res - Response object that represents the HTTP response that an Express app sends when it
 * gets an HTTP request. It contains methods to send a response back to the client, such as setting the
 * status code, sending JSON data, or rendering a template.
 * @returns The function `addStudentAttendance` returns a response with status code and JSON data.
 */
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

    // Create new attendance record
    const attendance = new Attendance({
      student,
      subject,
      status,
      note: note || "",
    });

    // Save attendance record
    const savedAttendance = await attendance.save();

    // Add the new attendance record to student's attendance array
    // Using $push to append to the array, not replace existing records
    const updatedStudent = await Student.findByIdAndUpdate(
      student,
      {
        $push: {
          // $push adds the new attendance ID to the existing array
          // This preserves all previous attendance records
          attendance: savedAttendance._id,
        },
      },
      {
        new: true, // Return the updated document
        // Don't use $set as it would replace the entire array
      }
    ).populate({
      path: "attendance",
      select: "subject status date",
      populate: {
        path: "subject",
        select: "name",
      },
    });

    if (!updatedStudent) {
      // If student update fails, delete the attendance record to maintain consistency
      await Attendance.findByIdAndDelete(savedAttendance._id);
      return res.status(404).json({
        message: "Student not found. Attendance record not created.",
      });
    }

    // Return both the new attendance record and the student with all attendance records
    res.status(201).json({
      message: "Attendance marked successfully.",
      attendance: savedAttendance,
      student: updatedStudent, // This includes all attendance records, not just the new one
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error." });
  }
};
/**
 * The function `updateStudentAttendance` is responsible for updating student attendance records based
 * on the provided parameters and returning appropriate responses.
 * @param req - req: The request object containing information sent by the client to the server. It
 * includes parameters, body, headers, and other details needed to process the request.
 * @param res - The `res` parameter in the `updateStudentAttendance` function is the response object
 * that will be used to send back the response to the client making the request. It is typically used
 * to set the status code, send JSON data, or render a view in response to the client's request. In
 * @returns The code snippet provided is an asynchronous function `updateStudentAttendance` that
 * handles updating student attendance based on the request parameters and body. It attempts to find
 * the student and attendance records by their IDs, then updates the attendance status, note, and date.
 */
const updateStudentAttendance = async (req, res) => {
  try {
    const { studentId, attendanceId } = req.params;
    const { status, note, date } = req.body;
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
    // const updatedAttendance = await Attendance.findByIdAndUpdate(
    //   attendanceId,
    //   {
    //     status,
    //     note: note || attendance.note, // Preserve existing note if not provided
    //     date: date || attendance.date, // Preserve existing date if not provided
    //   },
    //   { new: true, runValidators: true }
    // );
    // const updatedStudent = await Student.findByIdAndUpdate(
    //   studentId,
    //   {
    //     $set: {
    //       "attendance.$[elem].status": updatedAttendance.status,
    //       "attendance.$[elem].note": updatedAttendance.note,
    //       "attendance.$[elem].date": updatedAttendance.date,
    //     },
    //   },
    //   {
    //     new: true,
    //     runValidators: true,
    //     arrayFilters: [{ "elem._id": attendanceId }],
    //   }
    // );
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
/**
 * The function `getAttendanceForStudent` retrieves attendance records for a specific student and
 * handles error cases appropriately.
 * @param req - The `req` parameter in the `getAttendanceForStudent` function stands for the request
 * object. It contains information about the HTTP request that triggered the function, such as request
 * headers, parameters, body, and more. In this case, `req.params` is used to extract the `studentId
 * @param res - The `res` parameter in the `getAttendanceForStudent` function is the response object
 * that will be used to send a response back to the client making the request. It is typically used to
 * send HTTP responses with status codes, headers, and data back to the client.
 * @returns The `getAttendanceForStudent` function is returning a JSON response based on the outcome of
 * the database queries and operations within the try-catch block.
 */
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
/**
 * The function `addStudentScores` handles the addition of a student's score for a specific subject and
 * exam type, updating the student's information accordingly.
 * @param req - The `req` parameter in the `addStudentScores` function stands for the request object.
 * It contains information about the HTTP request made to the server, including data sent in the
 * request body, parameters, headers, and more. In this case, the function is expecting to receive data
 * related to a
 * @param res - The `res` parameter in the `addStudentScores` function is the response object that will
 * be used to send back the response to the client making the request. It is typically used to set the
 * status code, send JSON data, or render views in response to the client's request. In this
 * @returns The function `addStudentScores` returns a response based on the outcome of adding a
 * student's score. If the student is not found, it returns a 404 status with a message "Student not
 * found". If the student is not enrolled in the specified subject, it returns a 404 status with a
 * message "Student not enrolled in this subject". If a score already exists for the specified exam
 * type
 */
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
/**
 * The function `updateStudentScores` updates a student's score in a database based on the provided
 * score ID and returns a success message along with the updated score details.
 * @param req - The `req` parameter in the `updateStudentScores` function stands for the request
 * object. It contains information about the HTTP request that triggered the function, such as request
 * headers, parameters, body, and more. In this function, `req` is used to extract the `scoreId` from
 * @param res - The `res` parameter in the `updateStudentScores` function is the response object that
 * is used to send a response back to the client making the request. It is typically used to set the
 * status code, send JSON data, or render a view in response to the client's request. In the
 * @returns The `updateStudentScores` function is returning a JSON response based on different
 * scenarios:
 * 1. If the `scoreId` is missing in the request parameters, it returns a 400 status with a message
 * indicating that the Score ID is required.
 * 2. If the requested score is not found in the database, it returns a 404 status with a message
 * stating that the score was not found.
 * 3
 */
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
/**
 * The function `getAllBatches` retrieves all batches from a database and returns a response with the
 * batches if found, or an error message if not found or an error occurs.
 * @param req - The `req` parameter in the `getAllBatches` function typically represents the HTTP
 * request object, which contains information about the incoming request from the client, such as
 * headers, parameters, body, etc. It is commonly used to access data sent by the client to the server.
 * In this case,
 * @param res - The `res` parameter in the `getAllBatches` function is the response object that will be
 * used to send the response back to the client making the request. It is typically an instance of the
 * Express response object that allows you to send HTTP responses with data such as status codes,
 * headers, and
 * @returns If batches are found, a success response with status code 200 and a JSON object containing
 * the message "Batches found" along with the batches data will be returned. If no batches are found or
 * there is an error, an appropriate error response will be returned with the corresponding status code
 * and message.
 */
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

/**
 * The function `getTeacherDetails` retrieves a teacher's details along with information about the
 * batches they are associated with, including subjects, students, and attendance records.
 * @param req - `req` is the request object representing the HTTP request made by the client to the
 * server. It contains information about the request such as the URL, headers, parameters, body
 * content, and more. In this context, `req.userInfo.id` is used to retrieve the teacher's ID from the
 * authenticated
 * @param res - The `res` parameter in the `getTeacherDetails` function is the response object that
 * will be used to send back the response to the client making the request. It is typically an instance
 * of the Express response object that allows you to send HTTP responses with data like status codes,
 * JSON objects, or
 * @returns The `getTeacherDetails` function is returning JSON responses based on the outcome of the
 * asynchronous operations within the try-catch block. Here are the possible return scenarios:
 */
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
      .select(
        "name email contact alternateContact address joiningYear createdAt updatedAt isVerified"
      )
      .populate({
        path: "batches",
        select: "batchId name timing subjectId studentIds",
        populate: {
          path: "studentIds",
          select:
            "name email contact attendance address studentId admissionYear createdAt profileImage",
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

/**
 * Update teacher details by ID. Only provided fields will be updated.
 * @param req - Express request object (expects req.params.id and body fields)
 * @param res - Express response object
 */
const updateTeacherDetails = async (req, res) => {
  try {
    const teacherId = req.userInfo.id; // Assuming userInfo is set by the auth middleware
    const { error } = teacherUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
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
    const allowedFields = [
      "name",
      "email",
      "contact",
      "alternateContact",
      "address",
      "profileImage",
      "password", // allow password update
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && field !== "password")
        updateFields[field] = req.body[field];
    });
    // Handle password update
    if (req.body.password !== undefined) {
      const newPassword = req.body.password;
      const oldPassword = req.body.oldPassword;
      if (!newPassword.trim()) {
        return res.status(400).json({
          success: false,
          message: "Password cannot be empty",
        });
      }
      // Require oldPassword for password update
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password is required to update password",
        });
      }
      // Check if the provided old password matches the current password
      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        teacher.password
      );
      if (!isOldPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }
      // Check if the provided password is plain text (not already hashed)
      if (newPassword.length < 60) {
        const isSamePassword = await bcrypt.compare(
          newPassword,
          teacher.password
        );
        if (isSamePassword) {
          return res.status(400).json({
            success: false,
            message:
              "Your old password and new-password is same. Please enter a different password.",
          });
        }
        const genSalt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(newPassword, genSalt);
      } else {
        // If the password is already a hash (length > 60), do not hash again
        updateFields.password = newPassword;
      }
    }
    // Update the teacher record with new data
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Teacher details updated successfully.",
      data: updatedTeacher,
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
 * Resend verification email to unverified teacher
 * @async
 * @function resendVerificationEmailTeacher
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - Teacher's email address
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with email status
 * @throws {Error} When email sending fails or teacher not found
 */
const resendVerificationEmailTeacher = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const teacher = await Teacher.findOne({ email: email });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    if (teacher.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }
    const token = jwt.sign({ email: teacher.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await sendVerificationEmail(teacher.email, token);
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
  updateTeacherDetails,
  resendVerificationEmailTeacher,
};
