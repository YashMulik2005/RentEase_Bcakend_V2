const BookingDetails = require("../model/BookingDetails");
const moment = require("moment");

const createBooking = async (req, res) => {
  const {
    room_id,
    check_in_date,
    check_out_date,
    total_guests,
    guest_details,
  } = req.body;

  if (
    !room_id ||
    !check_in_date ||
    !check_out_date ||
    !total_guests ||
    !guest_details
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const booking = new BookingDetails({
      user_id: req.user._id,
      room_id,
      check_in_date,
      check_out_date,
      total_guests,
      guest_details,
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await BookingDetails.find({ user_id: req.user._id })
      .populate("user_id", "name email")
      .populate("room_id", "hotel_name address");

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getRoomBookingDates = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const bookings = await BookingDetails.find({ room_id: roomId })
      .select("check_in_date check_out_date")
      .exec();

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this room." });
    }

    const checkInDates = bookings.map((booking) =>
      moment(booking.check_in_date).format("YYYY-MM-DD")
    );
    const checkOutDates = bookings.map((booking) =>
      moment(booking.check_out_date).format("YYYY-MM-DD")
    );

    return res.status(200).json({
      roomId,
      checkInDates,
      checkOutDates,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving booking details." });
  }
};
module.exports = { createBooking, getBookings, getRoomBookingDates };
