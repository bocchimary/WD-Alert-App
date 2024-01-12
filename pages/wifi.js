const express = require('express');
const wifi = require('node-wifi');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());  // Move this line below the app definition

// Initialize wifi module
wifi.init({
  iface: null,
});

// Endpoint to trigger network scan
app.get('/scan', (req, res) => {
  // Scan for available networks
  wifi.scan((error, networks) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to scan networks' });
    } else {
      res.json(networks);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
