const jwt = require("jsonwebtoken");

const loginAuthorizationMiddleware = (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies.accessToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not an authorized user. Access denied!",
      });
    }

    // Verify token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.userInfo = decoded;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Session expired. Please log in again.",
          });
        }
        return res.status(403).json({
          success: false,
          message: "Invalid token. Access denied!",
        });
      }

      req.userInfo = decoded; // Attach decoded user data to request
      next();
    });
  } catch (e) {
    console.error("Auth Middleware Error:", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = loginAuthorizationMiddleware;
