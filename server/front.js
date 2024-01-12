const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3002;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db_alert",
});

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/stuffs", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    try {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.json({ message: "No data found." });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});
app.get("/nodemcu-info", (req, res) => {
  const query = "SELECT ip_address, location FROM users";

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error querying MySQL:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const info = result.map((row) => ({
        ip: row.ip_address,
        location: row.location,
      }));
      res.json(info);
    }
  });
});
// READ
app.get("/device", (req, res) => {
  connection.query("SELECT * FROM tbl_device", (err, results) => {
    try {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.json({ message: "No data found." });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.get("/gallons", (req, res) => {
  connection.query("SELECT * FROM addwater", (err, results) => {
    try {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.json({ message: "No data found." });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.get("/updated", (req, res) => {
  connection.query("SELECT * FROM updated", (err, results) => {
    try {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.json({ message: "No data found." });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.get("/api/data", (req, res) => {
  const query = "SELECT * FROM users";
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
