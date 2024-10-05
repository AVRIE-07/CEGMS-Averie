const express = require("express");
const UsersModel = require("../models/UsersModel"); // Ensure this path is correct
const router = express.Router();

// Route to get all users
router.get("/", async (req, res) => {
  try {
    const users = await UsersModel.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update User route
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, firstname, lastname, email, username, password } = req.body;

    const updatedUser = await UsersModel.findByIdAndUpdate(
      id,
      {
        role,
        firstname,
        lastname,
        email,
        username,
        password, // You should hash the password before saving
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

// Delete User route
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UsersModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

// Add user route
router.post("/add", async (req, res) => {
  const { role, firstName, lastName, email, username, password } = req.body;

  if (!firstName || !lastName || !email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Username must be 4-20 characters and contain only letters, numbers, or underscores.",
    });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, include one uppercase letter and one number.",
    });
  }

  try {
    const existingUser = await UsersModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email or username already exists.",
      });
    }

    const newUser = new UsersModel({
      role,
      firstname: firstName,
      lastname: lastName,
      email,
      username,
      password, // Hash password before saving
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

module.exports = router; // Make sure to export the router
