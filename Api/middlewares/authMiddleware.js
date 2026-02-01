const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require('../models/User.model');
const secret = process.env.SECRET;

const authenticate = async (req, res, next) => {
  try {
    // รับ token จาก cookie
    const token = req.cookies.token;

    //   ส่ง token มาไหม
    if (!token) {
      return res.status(401).send({ message: "Token is missing" });
    }

    // verify token ถูกไหม
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).send({ message: "Invalid or expired token" });
    }

    // ตรวจสอบว่า JWT payload มี id หรือไม่
    if (!decoded.id) {
      return res.status(401).send({ message: "Invalid token payload" });
    }

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // แนบข้อมูลผู้ใช้ใน req
    req.user = user;
    req.username = decoded.username;
    req.authorId = decoded.id;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send({ message: "Server error during authentication" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ message: "User not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: "Access Forbidden: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };