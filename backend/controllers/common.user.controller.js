const jwt = require("jsonwebtoken");
const Course = require("../models/subject.model");
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

module.exports = { userAuthCheck, getAllCourses };
