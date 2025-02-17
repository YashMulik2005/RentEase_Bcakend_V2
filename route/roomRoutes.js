const express = require("express");
const { createRoom, getRooms } = require("../controller/roomController");
const protect = require("../middlewares/authUserMid");
const router = express.Router();

router.post("/", createRoom);
router.get("/", getRooms);

module.exports = router;
