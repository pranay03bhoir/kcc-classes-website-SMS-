const teacherAuthMiddleware = (req, res, next) => {
  try {
    const userRole = req.userInfo.role;
    // console.log("User role:", userRole);
    if (userRole !== "teacher" && userRole !== "admin") {
      res.status(400).json({
        success: false,
        message: "Admin/Teacher rights required. Access denied",
      });
    } else {
      next();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = teacherAuthMiddleware;
