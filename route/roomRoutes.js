const express = require("express");
const {
  createRoom,
  getRooms,
  getRoomsByLocation,
  getRandomRooms,
  searchRooms,
  getRoomById,
} = require("../controller/roomController");
const protect = require("../middlewares/authUserMid");
const router = express.Router();

router.post("/", protect, createRoom);
router.get("/", getRooms);
router.get("/location/:city/:state", getRoomsByLocation);
router.get("/random", getRandomRooms);
router.get("/search", searchRooms);
router.get("/single/info/get/:id", getRoomById);

module.exports = router;
