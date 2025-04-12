const express = require("express");
const {
  createRoom,
  getRooms,
  getRoomsByLocation,
  getRandomRooms,
  searchRooms,
  getRoomById,
} = require("../controller/roomController");
const { authUserMid, authOwnerMid } = require("../middlewares/authUserMid");
const router = express.Router();

router.post("/", authUserMid, createRoom);
router.get("/", getRooms);
router.get("/location/:city/:state", getRoomsByLocation);
router.get("/random", getRandomRooms);
router.get("/search", searchRooms);
router.get("/single/info/get/:id", getRoomById);

module.exports = router;
