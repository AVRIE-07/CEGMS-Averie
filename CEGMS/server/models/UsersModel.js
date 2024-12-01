// models/UsersModel.js

const mongoose = require("mongoose");

// Helper function to generate the custom ID
function generateCustomId() {
  const year = new Date().getFullYear(); // Get the current year
  const randomNum = Math.floor(Math.random() * 10000) + 1; // Generate a random number between 1 and 10000
  return `IMSE${year}${randomNum}`;
}

// Define the schema for users
const UsersSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: generateCustomId, // Set the custom ID generator as the default value
      unique: true,
    },
    email: { type: String, required: true, unique: true }, // User's email
    password: { type: String, required: true }, // User's password
    username: { type: String, required: true }, // User's username
    contactNumber: { type: String, required: true }, // User's username
    emergencyContactNumber: { type: String, required: true }, // User's username
    firstname: { type: String, required: true }, // User's first name
    lastname: { type: String, required: true }, // User's last name
    role: { type: String, required: true }, // User's role (e.g., Admin, Employee)
  },
  {
    collection: "users", // Specify the collection name explicitly
  }
);

// Create the model based on the schema
const UsersModel = mongoose.model("Users", UsersSchema);

// Export the model for use in other files
module.exports = UsersModel;
