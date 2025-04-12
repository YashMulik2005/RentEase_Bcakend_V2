const express = require("express");
const {
  createBooking,
  getBookings,
  getRoomBookingDates,
  generateRecipt,
  getBookingHotel,
} = require("../controller/bookingController");
const { authUserMid, authOwnerMid } = require("../middlewares/authUserMid");

const router = express.Router();

router.post("/", authUserMid, createBooking);
router.get("/", authUserMid, getBookings);
router.get("/room/:roomId", getRoomBookingDates);
router.post("/receipt", generateRecipt);
router.get("/hotel", authOwnerMid, getBookingHotel);

module.exports = router;
