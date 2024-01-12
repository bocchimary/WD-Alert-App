const express = require('express');
const wifi = require('node-wifi');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json()); // Add this line to handle JSON data

wifi.init({
  iface: null,
});

app.get('/scan', (req, res) => {
  wifi.scan((error, networks) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to scan networks' });
    } else {
      res.json(networks);
    }
  });
});

app.post('/connect', (req, res) => {
  const { ssid, mac } = req.body;

  wifi.connect({ ssid, bssid: mac }, (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to connect to the network' });
    } else {
      res.json({ message: 'Connected to the network' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
