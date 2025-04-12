const express = require("express");
const {
  createPayment,
  getPayments,
} = require("../controller/paymentController");
const { authUserMid, authOwnerMid } = require("../middlewares/authUserMid");
const router = express.Router();

router.post("/", authUserMid, createPayment);
router.get("/", authUserMid, getPayments);

module.exports = router;
