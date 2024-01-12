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

async function connectToDatabase() {
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

async function getAllEsp8266ServerIPs() {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM users');
    return rows.map(row => row.ip_address);
  } catch (error) {
    console.error('Error fetching all ESP8266 server IPs from MySQL:', error);
    return [];
  }
}

const resetTime = { hours: 0, minutes: 0 }; // Set your desired reset time here (e.g., midnight)

async function resetConsumedAtCustomTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  if (hours === resetTime.hours && minutes === resetTime.minutes) {
    const resetValue = 0;
    
    await pool.promise().execute('UPDATE users SET consumed = ?', [resetValue]);
    console.log(`Reset data.consumed and consumed column to 0 at ${resetTime.hours}:${resetTime.minutes}.`);
  }
}
async function fetchDataFromESP8266AndUpdateDB(ipAddress) {
  try {
    if (!ipAddress) {
      console.log('Skipping data fetch from ESP8266 due to missing server IP.');
      return;
    }

    const response = await axios.get(`http://${ipAddress}/getwaterstatus`);
    const data = response.data;

    if (data.water_level === 'HIGH' || data.water_level === 'LOW') {
      console.log('Received data from ESP8266:', data.water_level);
      console.log('Consumed value from ESP8266:', data.consumed);

      await pool
        .promise()
        .execute(
          'UPDATE users SET water_level = ?, consumed = COALESCE(consumed, 0) + ? WHERE ip_address = ?',
          [data.water_level, data.consumed, ipAddress]
        );

      console.log('Data updated in MySQL');

      const [userResult] = await pool
      .promise()
      .execute('SELECT location FROM users WHERE ip_address = ?', [ipAddress]);

      if (userResult.length > 0) {
        const location = userResult[0].location;
      
        // Update the data.name with the location
        data.name = location;

      if (data.water_level === 'LOW' && data.consumed === 1) {
        await pool
          .promise()
          .execute(
            'INSERT INTO consumption_history (name, ip_address, water_level, consumed, timestamp) VALUES (?, ?, ?, ?, NOW())',
            [data.name, ipAddress, data.water_level, data.consumed]
          );
        console.log('Inserted into consumption_history in MySQL');
      }};



    // Update the 'remaining' column in the 'updated' table first
await pool.promise().execute(
  'UPDATE consumed_history SET remaining = gallons - consumed WHERE location = ?',[data.name]
   // Assuming id is 1, update accordingly
);

// Now retrieve the updated values
const [userResult1] = await pool.promise().execute(
  'SELECT gallons, remaining FROM updated WHERE id = ? ORDER BY id DESC LIMIT 1',
  [1]
);

if (userResult1.length > 0) {
  const galls = userResult1[0].gallons;
  data.gallons = galls;
  const remain = userResult1[0].remaining;

  data.remain = remain;
}

      // Insert into consumed_history table
      const [userRes] = await pool.promise().execute(
        'SELECT consumed FROM users WHERE ip_address = ?',
        [ipAddress]
      );
      
      if (userRes.length > 0) {
        const cons = userRes[0].consumed;
      
        data.cons = cons;
      
        const [lastInserted] = await pool.promise().execute(
          'SELECT consumed FROM consumed_history WHERE location = ? ORDER BY id DESC LIMIT 1',
          [data.name]
        );
      
        const lastConsumed = lastInserted.length > 0 ? lastInserted[0].consumed : 0;
      
        // Check if the new consumed value is greater than the last inserted value
        if (data.cons !== lastConsumed) {
          await pool.promise().execute(
            'INSERT IGNORE INTO consumed_history (location, consumed, gallons, remaining) VALUES (?,?,?,?)',
            [data.name, data.cons, data.gallons, data.remain]
          );
      
          console.log('New record inserted into consumed_history');
        } else {
          console.log('New consumed value is not greater than the last inserted value');
        }
      }

    } else {
      console.log('Invalid water level data:', data.water_level);
    }


    
  } catch (error) {
    console.error('Error with ESP8266 or MySQL:', error.message);
  }
}



async function updateDatabase(table, column, value, ipAddress) {
  const idQuery = `SELECT id FROM ${table} WHERE ip_address = ?`;
  const [idResult] = await pool.promise().execute(idQuery, [ipAddress]);
  const userId = idResult[0]?.id || 1; // Use the first ID found or a default value

  const query = `UPDATE ${table} SET ${column} = ? WHERE id = ?`;

  // Do not set the value to null if it's undefined
  const sanitizedValue = value !== undefined ? value : undefined;

  const [result] = await pool.promise().execute(query, [sanitizedValue, userId]);

  return result;
}


async function fetchDataFromDatabase(table, column) {
  const query = `SELECT ${column} FROM ${table}`;
  const [result] = await pool.promise().query(query);
  return result.map(row => row[column]);
}


async function startServer() {
  const app = express();
  const port = 3003;

  app.get('/getdatafromdb', async (req, res) => {
    try {
      const waterLevelResult = await fetchDataFromDatabase('users', 'water_level');
      const consumedResult = await fetchDataFromDatabase('users', 'consumed');
  
      console.log('Water Level:', waterLevelResult);
      console.log('Consumed:', consumedResult);
  
      res.json({ water_level: waterLevelResult, consumed: consumedResult });
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
    await resetConsumedAtCustomTime();

    const esp8266ServerIPs = await getAllEsp8266ServerIPs();

    if (esp8266ServerIPs.length > 0) {
      for (const ipAddress of esp8266ServerIPs) {
        await fetchDataFromESP8266AndUpdateDB(ipAddress);
      }
    } else {
      console.log('Skipping data fetch from ESP8266 due to missing server IPs.');
    }
  }, 10000);
}


main();