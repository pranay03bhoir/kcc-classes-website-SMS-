const jwt = require("jsonwebtoken");
const Course = require("../models/subject.model");
const Teacher = require("../models/teacher.model");
function userAuthCheck(req, res) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ loggedIn: true, role: decoded.role });
  } catch (err) {
    return res.status(401).json({ loggedIn: false });
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses to offer" });
    }
    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const searchATeacher = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Search term is required" });
    }
    const teacher = await Teacher.find({
      $regex: { name: search, $options: "i" },
    });
    if (!teacher) {
      return res.status(404).json({ message: "No teacher found" });
    }
    return res.status(200).json({ teacher });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = { userAuthCheck, getAllCourses, searchATeacher };
