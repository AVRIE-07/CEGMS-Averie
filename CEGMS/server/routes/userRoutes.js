const express = require("express");
const UsersModel = require("../models/UsersModel"); // Adjust the path if necessary
const bcrypt = require("bcrypt");

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router.get("/protected-route", isLoggedIn, (req, res) => {
  // This route is accessible only if the user has a valid session
  res.json({ message: "Welcome, authorized user!" });
});
// Route to handle user login with session
router.post("/login", async (req, res) => {
  const { email, username, password } = req.body;

  // Check if the user exists based on email or username
  const user = await UsersModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(401).json("Unauthorized: User not found");
  }

  // Compare the provided password with the hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json("Unauthorized: Incorrect password");
  }

  // Successful login, store user data in session
  req.session.user = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role, // Optional: store user role if needed for authorization
  };

  res.status(200).json({ message: "Login successful" });
});

module.exports = router;

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

  // Check if all required fields are provided
  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Username must be 4-20 characters and contain only letters, numbers, or underscores.",
    });
  }

  // Validate password format
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, include one uppercase letter and one number.",
    });
  }

  try {
    // Check if a user with the same email or username already exists
    const existingUser = await UsersModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email or username already exists.",
      });
    }

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user
    const newUser = new UsersModel({
      role,
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

// Route to get the user's profile (get-user-profile)
router.get("/get-user-profile", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.id; // Get the logged-in user's ID from the session
    const user = await UsersModel.findById(userId).select(
      "firstname lastname email username" 
    ); // Fetch the user by ID and select necessary fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Send the user's profile data as the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

module.exports = router;
