const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: [true, "Hotel name is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

module.exports = mongoose.model("Owner", ownerSchema);
