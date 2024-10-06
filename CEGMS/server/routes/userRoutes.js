const express = require("express");
const UsersModel = require("../models/UsersModel"); // Adjust the path if necessary

const router = express.Router();

// Route to handle user login
router.post("/login", async (req, res) => {
  const { email, username, password } = req.body;

  // Check if the user exists based on email or username
  const user = await UsersModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(401).json("Unauthorized: User not found");
  }

  // For demonstration, we directly compare passwords (make sure to hash in production)
  if (user.password !== password) {
    return res.status(401).json("Unauthorized: Incorrect password");
  }

  // Successful login, send success response or user data
  res.status(200).json("Success");
});

// Route to get all users
router.get("/get-users", async (req, res) => {
  try {
    const users = await UsersModel.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update User route
router.put("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, firstname, lastname, email, username, password } = req.body;

    // No password hashing, so we directly use the password from the request
    const updatedUser = await UsersModel.findByIdAndUpdate(
      id,
      {
        role,
        firstname,
        lastname,
        email,
        username,
        password, // Use the password directly
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
router.delete("/delete-user/:id", async (req, res) => {
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
router.post("/add-user", async (req, res) => {
  console.log("Request body:", req.body); // Log the request body for debugging
  const { role, firstname, lastname, email, username, password } = req.body;

  if (!firstname || !lastname || !email || !username || !password) {
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

    // No hashing here, directly save the password
    const newUser = new UsersModel({
      role,
      firstname,
      lastname,
      email,
      username,
      password, // Store the password directly
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

module.exports = router;
