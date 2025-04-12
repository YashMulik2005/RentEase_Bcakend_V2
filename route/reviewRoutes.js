const express = require("express");
const { createReview, getReviews } = require("../controller/reviewController");
const { authUserMid, authOwnerMid } = require("../middlewares/authUserMid");
const router = express.Router();

router.post("/", authUserMid, createReview);
router.get("/", getReviews);

module.exports = router;
