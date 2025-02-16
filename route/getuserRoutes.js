const express = require("express");
const { getUser } = require("../controller/getuserController");

const router = express.Router();

router.get("/getuser", getUser);

module.exports = router;
