const jwt = require("jsonwebtoken");
const Owner = require("../model/UserModel");
const dotenv = require("dotenv");

dotenv.config();

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  // console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_key);
    req.owner = await Owner.findById(decoded.id).select("-password");

    if (!req.owner) {
      return res.status(401).json({ message: "Owner not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
