const express = require("express");
const User = require("../models/userModel"); // Path to your User model
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }

    const userLogin = await User.findOne({ email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials pass" });
      } else {
        res.json({ message: "Login success" });
        res.set("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
        res.set("Access-Control-Allow-Credentials", "true");
      }
    } else {
      res.status(400).json({ error: "Inavalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  //   console.log(name);
  //   console.log(email);

  if (!email || !password) {
    return res.status(422).json({ error: "Please fill the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else {
      const user = new User({ email, password });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});


router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).send("Logout successful");
});

module.exports = router;
