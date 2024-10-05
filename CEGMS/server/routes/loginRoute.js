const express = require("express");
const router = express.Router();
const UsersModel = require("../models/UsersModel");

// Define the login route
router.post("/login", (req, res) => {
  const { email, username, password } = req.body;

  // Modify the query to search for either email or username
  UsersModel.findOne({
    $or: [{ email: email }, { username: username }],
  })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("The Password is Incorrect");
        }
      } else {
        res.json("No Record Existed");
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "An error occurred while processing the login." });
    });
});

module.exports = router;
