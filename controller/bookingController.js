const fs = require("fs-extra");
const pdf = require("pdf-creator-node");
const BookingDetails = require("../model/BookingDetails");
const moment = require("moment");
const { default: axios } = require("axios");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dgokxkckw",
  api_key: "755456698535662",
  api_secret: "X7JHLQfhpWIZlptMm5YGV1_QKGo",
});

const createBooking = async (req, res) => {
  const {
    room_id,
    check_in_date,
    check_out_date,
    total_guests,
    guest_details,
    amount,
  } = req.body;

  if (
    !room_id ||
    !check_in_date ||
    !check_out_date ||
    !total_guests ||
    !guest_details ||
    !amount
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
      amount,
    });

    await booking.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const generateRecipt = async (req, res) => {
  try {
    const { booking } = req.body;

    if (!booking) {
      return res.status(400).send("Booking data is required.");
    }

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Booking Confirmation</h1>
          <p>Thank you for your booking. Here are your booking details:</p>
          <table>
            <tr><th>Booking ID</th><td>${booking._id}</td></tr>
            <tr><th>Hotel</th><td>${booking.room_id.owner_id.hotelName}, ${
      booking.room_id.apartment
    }</td></tr>
            <tr><th>Address</th><td>
              ${booking.room_id.owner_id.streetName}, ${
      booking.room_id.owner_id.city
    }, 
              ${booking.room_id.owner_id.state} - ${
      booking.room_id.owner_id.postalCode
    }, 
              ${booking.room_id.owner_id.country}
            </td></tr>
            <tr><th>Check-in Date</th><td>${new Date(
              booking.check_in_date
            ).toDateString()}</td></tr>
            <tr><th>Check-out Date</th><td>${new Date(
              booking.check_out_date
            ).toDateString()}</td></tr>
            <tr><th>Total Guests</th><td>${booking.total_guests}</td></tr>
            <tr><th>Guest Details</th><td>${booking.guest_details
              .map(
                (guest) =>
                  `${guest.name}, Age: ${guest.age}, Gender: ${guest.gender}`
              )
              .join("<br>")}</td></tr>
            <tr><th>Amount Paid</th><td>₹${booking.amount}</td></tr>
            ${
              booking.pdf
                ? `<tr><th>Receipt</th><td><a href="${booking.pdf}" target="_blank">Download PDF</a></td></tr>`
                : ""
            }
          </table>
        </body>
      </html>`;

    res.send(html);
  } catch (error) {
    console.error("Error generating receipt:", error);
    res.status(500).send("Error generating receipt");
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await BookingDetails.find({ user_id: req.user._id })
      .populate("user_id", "name email")
      .populate({
        path: "room_id",
        model: "Rooms",
        select: "hotel_name titleImage owner_id",
        populate: {
          path: "owner_id",
          model: "Owner",
          select:
            "hotelName apartment streetName city state postalCode country",
        },
      });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        .status(200)
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

// const generateRecipt = async (req, res) => {
//   const { id } = req.params;
//   console.log(id);
//   try {
//     const userData = {
//       name: "John Doe",
//       email: "john@example.com",
//       phone: "1234567890",
//       address: "123 Street, City, Country",
//     };

//     const pdfBuffer = await generatePDF(userData);

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", 'attachment; filename="user.pdf"');
//     res.send(pdfBuffer);
//   } catch (error) {
//     res.status(500).json({ error: "Error generating PDF" });
//   }
// };

module.exports = {
  createBooking,
  getBookings,
  getRoomBookingDates,
  generateRecipt,
};
