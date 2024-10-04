// models/Employee.js

const mongoose = require("mongoose");

// Define the schema for employees
const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },      // Employee's name
  email: { type: String, required: true, unique: true }, // Employee's email
  password: { type: String, required: true }  , // Employee's password
  username: { type: String, required: true } 
}, {
  collection: 'users' // Specify the collection name explicitly
});

// Create the model based on the schema
const UsersModel = mongoose.model("Users", UsersSchema);

// Export the model for use in other files
module.exports = UsersModel;
