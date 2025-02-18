const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: [true, "Hotel name is required"],
    trim: true,
  },
  apartment: {
    type: String,
    required: [true, "Apartment is required"],
    trim: true,
  },
  streetName: {
    type: String,
    required: [true, "Street name is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, "Postal code is required"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
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
