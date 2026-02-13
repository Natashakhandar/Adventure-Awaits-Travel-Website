require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "adventure_db"
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

/* ================= BOOKING API ================= */
app.post("/api/book", (req, res) => {
  const { destination, fullName, email, phone, travelDate, guests, specialRequirements } = req.body;

  const sql = `
    INSERT INTO bookings
    (destination, full_name, email, phone, travel_date, guests, special_requirements)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [destination, fullName, email, phone, travelDate, guests, specialRequirements],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Booking failed" });
      res.json({ message: "Booking saved successfully" });
    });
});

/* ================= CONTACT API ================= */
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  const sql = `
    INSERT INTO contact_messages
    (name, email, message)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, message],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Message failed" });
      res.json({ message: "Message saved successfully" });
    });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
