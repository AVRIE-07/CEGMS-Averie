// models/UsersModel.js

const mongoose = require("mongoose");

// Define the schema for users
const UsersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, // User's email

    password: { type: String, required: true }, // User's password
    username: { type: String, required: true }, // User's username

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
