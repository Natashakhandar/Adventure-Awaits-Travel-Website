require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ================= HEALTH CHECK ================= */
app.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.send("🚀 API running & DB connected");
  } catch (err) {
    res.status(500).send("❌ DB connection failed");
  }
});

/* ================= BOOKING ================= */
app.post("/api/book", async (req, res) => {
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
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await pool.query(
      `INSERT INTO bookings
       (destination, full_name, email, phone, travel_date, guests, special_requirements)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        destination,
        fullName,
        email,
        phone,
        travelDate,
        guests,
        specialRequirements || ""
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= CONTACT ================= */
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1,$2,$3)`,
      [name, email, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));