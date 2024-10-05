const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UsersModel = require("./models/UsersModel");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/inventory-system")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Login

app.post("/login", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    let user;

    // Check if the request is made using email or username
    if (email) {
      user = await UsersModel.findOne({ email });
    } else if (username) {
      user = await UsersModel.findOne({ username });
    }

    // If user not found or password does not match
    if (!user || user.password !== password) {
      return res.status(404).json("No Record Existed");
    }

    // If login is successful
    res.status(200).json("Success");
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred during login.");
  }
});

// Route to get all users
app.get("/get-users", async (req, res) => {
  try {
    const users = await UsersModel.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});
// Update User route
app.put("/update-user/:id", async (req, res) => {
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
app.delete("/delete-user/:id", async (req, res) => {
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
app.post("/add-user", async (req, res) => {
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
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
