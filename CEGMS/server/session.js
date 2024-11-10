const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionStore = new MongoStore({
  mongoUrl: "mongodb://localhost:27017/inventory-system", // Replace with your MongoDB URI
  collection: "sessions", // Optional: Name of the collection to store sessions
});

module.exports = sessionStore;
