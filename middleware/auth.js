const jwt = require("jsonwebtoken");
const user = require("../model/User");

//* Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //* Make sure token exists
  if (!token || token === "null") {
    return res.status(401).json({
      success: false,
      error: "You are not authorized to access this route",
    });
  }

  try {
    //* Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await user.findById(decoded.id);
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({
      success: false,
      error: "You are not authorized to access this route",
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
