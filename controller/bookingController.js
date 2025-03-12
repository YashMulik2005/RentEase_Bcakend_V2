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

    // Generate PDF
    const pdfPath = await generatePDF(booking);
    console.log("PDF generated at:", pdfPath);

    // Upload PDF to Cloudinary
    const pdfUrl = await uploadToCloudinary(pdfPath);
    console.log("Uploaded PDF URL:", pdfUrl);
    booking.pdf = pdfUrl;
    await booking.save();

    res.status(201).json({ message: "Booking successful", booking, pdfUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const generatePDF = async (booking) => {
  try {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Booking Confirmation</h1>
          <p>Thank you for your booking. Here are your booking details:</p>
          <table>
            <tr><th>Booking ID</th><td>${booking._id}</td></tr>
            <tr><th>Room ID</th><td>${booking.room_id}</td></tr>
            <tr><th>Check-in Date</th><td>${booking.check_in_date}</td></tr>
            <tr><th>Check-out Date</th><td>${booking.check_out_date}</td></tr>
            <tr><th>Total Guests</th><td>${booking.total_guests}</td></tr>
            <tr><th>Guest Details</th><td>${JSON.stringify(
              booking.guest_details
            )}</td></tr>
            <tr><th>Amount Paid</th><td>$${booking.amount}</td></tr>
          </table>
        </body>
      </html>
    `;

    const options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };

    const document = {
      html: html,
      data: {},
      path: "./booking.pdf",
      type: "",
    };

    await pdf.create(document, options);
    return document.path;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};

// const uploadToCloudinary = async (filePath) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", fs.createReadStream(filePath));
//     formData.append("upload_preset", "receipt_pdf");

//     const response = await axios.post(
//       "https://api.cloudinary.com/v1_1/dgokxkckw/raw/upload",
//       formData
//     );

//     console.log("PDF uploaded successfully:", response.data.secure_url);

//     // Remove local file after upload
//     await fs.remove(filePath);
//     return response.data.secure_url;
//   } catch (error) {
//     console.error("Error uploading PDF:", error);
//     return null;
//   }
// };

const uploadToCloudinary = async (pdfPath) => {
  try {
    const result = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

const generateBookingPDF = async (booking) => {
  try {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Booking Confirmation</h1>
          <p>Thank you for your booking. Here are your booking details:</p>
          <table>
            <tr><th>Booking ID</th><td>${booking._id}</td></tr>
            <tr><th>Room ID</th><td>${booking.room_id}</td></tr>
            <tr><th>Check-in Date</th><td>${booking.check_in_date}</td></tr>
            <tr><th>Check-out Date</th><td>${booking.check_out_date}</td></tr>
            <tr><th>Total Guests</th><td>${booking.total_guests}</td></tr>
            <tr><th>Guest Details</th><td>${JSON.stringify(
              booking.guest_details
            )}</td></tr>
            <tr><th>Amount Paid</th><td>$${booking.amount}</td></tr>
          </table>
        </body>
      </html>
    `;

    const options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };

    const document = {
      html: html,
      data: {},
      path: "./booking.pdf",
      type: "",
    };

    await pdf.create(document, options);
    console.log("PDF generated successfully!");
    return document.path;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
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

const generateRecipt = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      address: "123 Street, City, Country",
    };

    const pdfBuffer = await generatePDF(userData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="user.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: "Error generating PDF" });
  }
};
module.exports = {
  createBooking,
  getBookings,
  getRoomBookingDates,
  generateRecipt,
};
