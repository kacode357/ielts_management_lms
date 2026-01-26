// Authentication middleware - Verify JWT token
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/appError");
const MESSAGES = require("../constants/messages");

async function auth(req, res, next) {
  try {
    // Get token from header or cookie
    let token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError(MESSAGES.ERROR.MISSING_TOKEN, 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError(MESSAGES.ERROR.INVALID_TOKEN, 401));
    }
    next(error);
  }
}

module.exports = auth;
