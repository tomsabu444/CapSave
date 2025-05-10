const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, displayname } = req.user;

    const existing = await User.findOne({ userId : uid });
    if (existing) return res.status(200).json({ message: "User already exists" });

    const newUser = new User({
      userId : uid,
      email,
      displayname,
    });

    await newUser.save();
    res.status(201).json({ message: "User saved" });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
