const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UsersModel = require("./models/UsersModel");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/inventory-system").then(() => {
  console.log("Connected to the MongoDB database");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

/*--------------------------LOGIN---------------------------- */

app.post("/login", (req, res) => {
  const { email, username, password } = req.body;

  // Modify the query to search for either email or username
  UsersModel.findOne({
    $or: [{ email: email }, { username: username }]
  }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("The Password is Incorrect");
      }
    } else {
      res.json("No Record Existed");
    }
  }).catch((err) => {
    res.status(500).json({ error: "An error occurred while processing the login." });
  });
});

app.listen(3001, () => {
  console.log("Server is Running");
});
/*--------------------------/LOGIN---------------------------- */
