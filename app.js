const express = require("express");
const app = express();
const port = 5000;
const path = require("path");

const sqlite3 = require("sqlite3").verbose();

app.use(express.json()); // Middleware to parse JSON data

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database("./flow_database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Initialize tables
db.serialize(() => {
  // Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      rfid_uid VARCHAR(100),
      name VARCHAR(100) ,
      address VARCHAR(100) ,
      email VARCHAR(100) UNIQUE ,
      phone VARCHAR(100) ,
      role VARCHAR(100) CHECK(role IN ('admin', 'operator', 'customer')) ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Kiosks Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Kiosks (
      kiosk_id INTEGER PRIMARY KEY AUTOINCREMENT,
      location VARCHAR(100) ,
      status VARCHAR(100) CHECK(status IN ('active', 'maintenance', 'inactive')) ,
      last_serviced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sensors Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Sensors (
      sensor_id INTEGER PRIMARY KEY AUTOINCREMENT,
      kiosk_id INTEGER,
      sensor_type TEXT CHECK(sensor_type IN ('water_quality', 'flow_rate', 'temperature')) ,
      threshold_min REAL,
      threshold_max REAL,
      status TEXT CHECK(status IN ('active', 'faulty', 'offline')) ,
      FOREIGN KEY (kiosk_id) REFERENCES Kiosks(kiosk_id)
    )
  `);

  // Sensor Readings Table
  db.run(`
    CREATE TABLE IF NOT EXISTS SensorReadings (
      reading_id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensor_id INTEGER,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      value REAL ,
      FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id)
    )
  `);

  // Water Usage Table
  db.run(`
    CREATE TABLE IF NOT EXISTS WaterUsage (
      usage_id INTEGER PRIMARY KEY AUTOINCREMENT,
      kiosk_id INTEGER,
      user_id INTEGER,
      quantity REAL ,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kiosk_id) REFERENCES Kiosks(kiosk_id),
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
    )
  `);

  // Payments Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Payments (
      payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      kiosk_id INTEGER,
      amount REAL ,
      payment_method TEXT CHECK(payment_method IN ('Orange Money', 'cash', 'mobile payment')) ,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(user_id),
      FOREIGN KEY (kiosk_id) REFERENCES Kiosks(kiosk_id)
    )
  `);

  // Alerts Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Alerts (
      alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensor_id INTEGER,
      kiosk_id INTEGER,
      alert_type TEXT CHECK(alert_type IN ('low_quality', 'high_usage', 'low_balance')) ,
      message TEXT ,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id),
      FOREIGN KEY (kiosk_id) REFERENCES Kiosks(kiosk_id)
    )
  `);

  // Admin Dashboard Logs Table
  db.run(`
    CREATE TABLE IF NOT EXISTS AdminDashboardLogs (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      activity TEXT ,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES Users(user_id)
    )
  `);

  console.log("Database tables created successfully.");
});

// Static files render configurations
app.use("/public", express.static(__dirname + "/public/"));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// =============================== Get Routes ==============================

app.get("/", (req, res) => {
  res.render("flow_dashboard");
});

app.get("/kiosks", (req, res) => {
  res.render("kiosks");
});

app.get("/community_kiosk", (req, res) => {
  res.render("communities_kiosk_report");
});

app.post("/sensor-data", (req, res) => {
  const data = req.body; // Expecting data in JSON format
  console.log("Received data:", data);
  res.status(200).send("Data received");
});

// Post Routes

// Hosting Configuration

app.listen(port, () => {
  console.log(`Server is live on: ${port}`);
});
