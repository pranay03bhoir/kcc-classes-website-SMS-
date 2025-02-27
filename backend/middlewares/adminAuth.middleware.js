const adminAuthMiddleware = (req, res, next) => {
  try {
    const userRole = req.userInfo.role;
    if (userRole !== "admin") {
      res.status(400).json({
        success: false,
        message: "Admin rights required, Access denied",
      });
    } else {
      next();
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = adminAuthMiddleware;
