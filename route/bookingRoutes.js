const express = require("express");
const {
  createBooking,
  getBookings,
  getRoomBookingDates,
  generateRecipt,
} = require("../controller/bookingController");
const authUserMid = require("../middlewares/authUserMid");

const router = express.Router();

router.post("/", authUserMid, createBooking);
router.get("/", authUserMid, getBookings);
router.get("/room/:roomId", getRoomBookingDates);
router.get("/receipt", generateRecipt);

module.exports = router;
