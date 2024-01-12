const axios = require('axios');
const mysql = require('mysql2');
const express = require('express');

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'db_alert',
};

const pool = mysql.createPool(dbConfig);

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        console.log('Connected to MySQL');
        connection.release();
        resolve();
      }
    });
  });
}

async function getEsp8266ServerIP() {
    try {
      const [result] = await pool.promise().query('SELECT ip_address FROM users');
      const rows = result;

      if (rows.length > 0) {
        const ipAddresses = rows.map(row => row.ip_address);
        console.log('IP addresses:', ipAddresses);
        return ipAddresses;
      } else {
        console.error('Error: No records found in tbl_device table.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching ESP8266 server IPs from MySQL:', error);
      return null;
    }
  }

async function fetchDataFromESP8266(ipAddresses) {
  for (const ipAddress of ipAddresses) {
    try {
      const response = await axios.get(`http://${ipAddress}/getwaterstatus`);
      const data = response.data;
      console.log(data);
      if (data.water_level === 'HIGH' || data.water_level === 'LOW') {
        console.log(`Received data from ESP8266 at ${ipAddress}:`, data.water_level);

        await pool.promise().execute('UPDATE tbl_device SET water_level = ?, consumed = consumed + ? WHERE ip_address = ?', [data.water_level, data.consumed, ipAddress]);      
        //await pool.promise().execute('UPDATE inventory SET consumed = consumed + ? WHERE ip_address = ?', [data.consumed, ipAddress]);
        //await pool.promise().execute('UPDATE users SET water_level = ?, consumed = consumed + ? WHERE ip_address = ?', [data.water_level, data.consumed, ipAddress]);
        console.log('Data updated in MySQL');
      } else {
        console.log(`Invalid water level data from ESP8266 at ${ipAddress}:`);
      }
    } catch (error) {
      console.error(`Error with ESP8266 or MySQL for IP ${ipAddress}:`, error);
      await pool.promise().execute('UPDATE tbl_device SET water_level = "error" WHERE ip_address = ?', [ipAddress]);
    }
  }
}

async function startServer() {
  const app = express();
  const port = 3003;

  app.get('/getdatafromdb', async (req, res) => {
    try {
      const [result] = await pool.promise().query('SELECT * FROM stats');
      const rows = result[0];
      res.json({ rows });
    } catch (error) {
      console.error('Error with MySQL:', error);
      res.status(500).json({ error: 'Failed to fetch data from MySQL' });
    }
  });

  app.get('/inventorydb', async (req, res) => {
    try {
      const [result] = await pool.promise().query('SELECT * FROM inventory');
      const rows = result[0];
      res.json({ rows });
    } catch (error) {
      console.error('Error with MySQL:', error);
      res.status(500).json({ error: 'Failed to fetch data from MySQL' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

async function main() {
  try {
    await connectToDatabase();
    await startServer();
  } catch (error) {
    console.error('Error initializing the application:', error);
    process.exit(1);
  }

  setInterval(async () => {
    const esp8266ServerIP = await getEsp8266ServerIP();

    if (esp8266ServerIP) {
      await fetchDataFromESP8266(esp8266ServerIP);
    } else {
      console.log('Skipping data fetch from ESP8266 due to missing server IP.');
    }
  }, 10000);
}

main();
