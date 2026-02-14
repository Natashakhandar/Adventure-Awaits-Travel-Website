require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DATABASE CONNECTION ================= */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

/* ================= CONNECT DATABASE ================= */
db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err);
    return;
  }

  console.log("✅ Connected to MySQL Server (XAMPP)");
  console.log("📦 Using Database: adventure_db");

  // Auto create tables if missing (SAFE)
  db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      destination VARCHAR(255),
      full_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(20),
      travel_date DATE,
      guests INT,
      special_requirements TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend is running & DB connected!");
});

/* ================= BOOKING API ================= */
app.post("/api/book", (req, res) => {
  const {
    destination,
    fullName,
    email,
    phone,
    travelDate,
    guests,
    specialRequirements
  } = req.body;

  if (!destination || !fullName || !email || !phone || !travelDate || !guests) {
    return res.status(400).json({
      message: "❌ Missing required booking fields"
    });
  }

  const sql = `
    INSERT INTO bookings
    (destination, full_name, email, phone, travel_date, guests, special_requirements)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      destination,
      fullName,
      email,
      phone,
      travelDate,
      guests,
      specialRequirements || ""
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Booking Insert Error:", err);
        return res.status(500).json({
          message: "Booking failed (DB error)"
        });
      }

      console.log("📌 Booking Saved:", fullName, destination);
      res.json({
        message: "✅ Booking saved successfully!"
      });
    }
  );
});

/* ================= CONTACT API ================= */
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "❌ All contact fields are required"
    });
  }

  const sql = `
    INSERT INTO contact_messages (name, email, message)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("❌ Contact Insert Error:", err);
      return res.status(500).json({
        message: "Message failed (DB error)"
      });
    }

    console.log("📩 Contact Saved:", name);
    res.json({
      message: "✅ Message saved successfully!"
    });
  });
});

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
