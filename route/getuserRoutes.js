const express = require("express");
const { getUser } = require("../controller/getuserController");
const protect = require("../middlewares/authUserMid");
const router = express.Router();

router.get("/getuser", protect, getUser);

module.exports = router;
