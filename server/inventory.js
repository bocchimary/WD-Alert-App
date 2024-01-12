const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3005;

app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'db_alert',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// API Endpoints
app.get('/api/water-gallons', (req, res) => {
  // Retrieve water gallons from the database
  db.query('SELECT * FROM water_gallons', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/api/water-gallons', (req, res) => {
  // Add a new water gallon to the database
  const { name, quantity } = req.body;
  db.query(
    'INSERT INTO water_gallons (name, quantity) VALUES (?, ?)',
    [name, quantity],
    (error, results) => {
      if (error) throw error;
      res.json(results.insertId);
    }
  );
});

app.put('/api/water-gallons/:id', (req, res) => {
  // Update a water gallon in the database
  const { id } = req.params;
  const { quantity } = req.body;
  db.query(
    'UPDATE water_gallons SET quantity = ? WHERE id = ?',
    [quantity, id],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
});

app.delete('/api/water-gallons/:id', (req, res) => {
  // Delete a water gallon from the database
  const { id } = req.params;
  db.query('DELETE FROM water_gallons WHERE id = ?', [id], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
