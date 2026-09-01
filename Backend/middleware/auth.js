require("dotenv").config();
const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
    const cleanToken = bearerToken.replace("Bearer ", "");
    const matchToken = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.admin = matchToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = { verifyToken };
