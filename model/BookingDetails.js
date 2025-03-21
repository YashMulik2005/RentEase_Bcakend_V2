const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingDetailsSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  total_guests: { type: Number, required: true },
  guest_details: { type: Schema.Types.Mixed, required: true },
  amount: { type: Number, required: true },
  pdf: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BookingDetails", bookingDetailsSchema);
