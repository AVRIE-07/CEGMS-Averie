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
    email: { type: String, unique: true }, // User's email
    password: { type: String }, // User's password
    firstname: { type: String }, // User's first name
    lastname: { type: String }, // User's last name
    address: { type: String }, // User's address
    personalContactNumber: { type: String }, // Personal contact number
    emergencyContactPerson: { type: String }, // Emergency contact person
    emergencyContactNumber: { type: String }, // Emergency contact number
    role: { type: String }, // User's role (e.g., Admin, Employee)
  },
  {
    collection: "users", // Specify the collection name explicitly
  }
);

// Create the model based on the schema
const UsersModel = mongoose.model("Users", UsersSchema);

// Export the model for use in other files
module.exports = UsersModel;
