const express = require("express");
const {
  createPayment,
  getPayments,
} = require("../controller/paymentController");
const protect = require("../middlewares/authUserMid");
const router = express.Router();

router.post("/", protect, createPayment);
router.get("/", protect, getPayments);

module.exports = router;
