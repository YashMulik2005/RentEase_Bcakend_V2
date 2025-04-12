const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");
const dotenv = require("dotenv");
const Owner = require("../model/OwnerModel");

dotenv.config();

const authUserMid = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_key);
    console.log(process.env.jwt_key);
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const authOwnerMid = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_key);
    console.log(process.env.jwt_key);
    req.user = await Owner.findById(decoded.ownerId);
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { authUserMid, authOwnerMid };
