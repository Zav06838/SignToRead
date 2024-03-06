const express = require("express");

// controller functions
const { LoginUser, RegisterUser } = require("../controllers/userController");
// const { loginUser, signupUser } = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", LoginUser);

// signup route
router.post("/register", RegisterUser);

module.exports = router;
