const express = require("express");
const { signup, login } = require("../controller/UserController");
const { ownerSignup, ownerLogin } = require("../controller/OwnerController");

const router = express.Router();

router.post("/usersignup", signup);
router.post("/userlogin", login);
router.post("/ownersignup", ownerSignup);
router.post("/ownerlogin", ownerLogin);

module.exports = router;
