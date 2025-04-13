const Reviews = require("../model/Reviews");
const Room = require("../model/Rooms");

const createReview = async (req, res) => {
  try {
    const { room_id, rating, review_text } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    const review = new Reviews({
      user_id: req.user.id,
      room_id,
      rating,
      review_text,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const getReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Room ID is required." });
    }

    const reviews = await Reviews.find({ room_id: id }).populate(
      "user_id",
      "username email"
    );

    return res.status(200).json({
      status: true,
      data: reviews,
    });
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(500).json({
      status: false,
      message: "Server error while fetching reviews.",
    });
  }
};

module.exports = { createReview, getReviews };
