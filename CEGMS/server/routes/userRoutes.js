const express = require("express");
const UsersModel = require("../models/UsersModel"); // Adjust the path if necessary
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Route to handle user login with session
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Match user by email or username
    const user = await UsersModel.findOne({
      $or: [{ email: identifier }, { username: identifier }], // Ensure both email and username are checked
    });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "yourSecretKey", {
      expiresIn: "1h",
    });

    res.json({
      token,
      username: user.username, // Ensure username is sent
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      userId: user._id, // Correcting to user._id
      address: user.address || "", // Default empty string if address is not set
      emergencyContactPerson: user.emergencyContactPerson || "", // Same for emergency contact person
      emergencyContactNumber: user.emergencyContactNumber || "", // Same for emergency contact number
      personalContactNumber: user.personalContactNumber || "", // Same for personal contact number
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
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
// Update User route
router.put("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      role,
      firstname,
      lastname,
      email,
      password,
      address,
      personalContactNumber,
      emergencyContactPerson,
      emergencyContactNumber,
    } = req.body;

    // No password hashing, so we directly use the password from the request
    const updatedUser = await UsersModel.findByIdAndUpdate(
      id,
      {
        role,
        firstname,
        lastname,
        email,
        password, // Use the password directly
        address, // Added field
        personalContactNumber, // Added field
        emergencyContactPerson, // Added field
        emergencyContactNumber, // Added field
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
  const {
    role,
    firstname,
    lastname,
    email,
    password,
    address,
    personalContactNumber,
    emergencyContactPerson,
    emergencyContactNumber,
  } = req.body;

  // Check if all required fields are provided
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !address ||
    !personalContactNumber ||
    !emergencyContactPerson ||
    !emergencyContactNumber
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
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
    // Check if a user with the same email already exists
    const existingUser = await UsersModel.findOne({
      $or: [{ email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists.",
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
      password: hashedPassword, // Store the hashed password
      address, // Added field
      personalContactNumber, // Added field
      emergencyContactPerson, // Added field
      emergencyContactNumber, // Added field
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

router.put("/profile/update-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await UsersModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;

    // Save the updated user to the database
    const updatedUser = await user.save();

    // Send back updated user data
    res.status(200).json({
      message: "Profile updated successfully!",
      updatedUser: {
        userId: updatedUser.userId,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Update user profile
// Route for changing the user's password
router.put("/profile/change-password/:userId", async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Find the user by the custom userId
    const user = await UsersModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the current password with the stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
