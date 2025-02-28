const adminAuthMiddleware = (req, res, next) => {
  try {
    if (!req.userInfo || !req.userInfo.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user information",
      });
    }

    // console.log("User role:", req.userInfo.role);

    if (req.userInfo.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin rights required, Access denied",
      });
    }

    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = adminAuthMiddleware;
