const jwt = require("jsonwebtoken");

const loginAuthorizationMiddleware = (req, res, next) => {
  try {
    // const authHeaders = req.headers["authorization"];
    const token = req.cookies.token;
    // console.log(token);
    // console.log(authHeaders);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not an authorized user. Access denied !!!",
      });
    } else {
      req.userInfo = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded token",decodedToken);
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

module.exports = loginAuthorizationMiddleware;
