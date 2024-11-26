// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const ReportModel = require("../models/Inventory/InventoryReports");

// Endpoint to create a new report
router.post("/", async (req, res) => {
  const { reportType, startDate, endDate } = req.body;
  const report_ID = `RI${String(Math.floor(Math.random() * 100000)).padStart(
    5,
    "0"
  )}`; // Generate a random report ID with 5 digits

  try {
    const newReport = new ReportModel({
      report_ID,
      reportType,
      startDate,
      endDate,
      generatedDate: new Date().toISOString(), //
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error(
      "Error generating report:",
      error.response ? error.response.data : error.message
    );
  }
});

// Route to get all users
router.get("/", async (req, res) => {
  try {
    const users = await ReportModel.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Reports" });
  }
});

module.exports = router;
