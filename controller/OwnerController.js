const Owner = require("../model/OwnerModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ownerSignup = async (req, res) => {
  try {
    const {
      hotelName,
      apartment,
      streetName,
      city,
      state,
      postalCode,
      country,
      mobileNo,
      name,
      email,
      password,
    } = req.body;

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newOwner = new Owner({
      hotelName,
      apartment,
      streetName,
      city,
      state,
      postalCode,
      country,
      mobileNo,
      name,
      email,
      password,
    });
    await newOwner.save();

    res.status(201).json({ message: "Owner registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const ownerlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner || owner.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ ownerId: owner._id }, process.env.jwt_key);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { ownerSignup, ownerlogin };
