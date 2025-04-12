const express = require("express");
const { getUser, getOwner } = require("../controller/getuserController");
const { authUserMid, authOwnerMid } = require("../middlewares/authUserMid");
const router = express.Router();

router.get("/getuser", authUserMid, getUser);
router.get("/getowner", authOwnerMid, getOwner);

module.exports = router;
