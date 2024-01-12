const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Create a connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'db_alert',
// Adjust this based on your requirements
});

app.use(cors());
app.use(bodyParser.json());



app.post('/register', (req, res) => {
  const { ip_address, location } = req.body;

  // Check for duplicate IP address
  pool.query('SELECT * FROM users WHERE ip_address = ?', [ip_address], (selectErr, selectResults) => {
      if (selectErr) {
          console.error('Error checking for duplicate IP:', selectErr);
          res.status(500).send('Error checking for duplicate IP.');
      } else {
          if (selectResults.length > 0) {
              res.status(409).send('IP address already exists');
          } else {
              // No duplicate found, proceed with the insertion
              pool.query('INSERT INTO users (ip_address, location) VALUES (?, ?)', [ip_address, location], (insertErr, insertResults) => {
                  if (insertErr) {
                      console.error('Error inserting data:', insertErr);
                      res.status(500).send('Error inserting data into the database.');
                  } else {
                      console.log('User has been registered successfully!');
                      res.status(200).send('User has been registered successfully!');
                  }
              });
          }
      }
  });
});

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { location, ip_address } = req.body;

  pool.query('UPDATE users SET location = ?, ip_address = ? WHERE id = ?', [location, ip_address, userId], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Error updating user.');
    } else {
      console.log('User updated successfully!');
      res.status(200).send('User updated successfully!');
    }
  });
});
 
// CHECK IF DUPLICATE IP
app.post('/checkDuplicate', (req, res) => {
  const { ip_address} = req.body;

  pool.query('SELECT 1 FROM users WHERE ip_address = ?', [ip_address], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error checking for duplicate data:', selectErr);
      res.status(500).json({ error: 'Error checking for duplicate data.' });
    } else {
      if (selectResults.length > 0) {
        // Duplicate IP address found
        const dupe = ip_address;
        console.log('Duplicate IP address:', dupe);
        res.status(200).json({ duplicate: true });
      } else {
        // No duplicate found
        res.status(200).json({ duplicate: false });
      }
    }

  });
});
app.post('/checknull', (req, res) => {
  // Extract IP address from the request body
  const ip_address = req.body.ip_address;

  // Check if the column consumed and water_level are null for the given IP address
  const checkQuery = 'SELECT 1 FROM users WHERE ip_address = ? AND water_level IS NULL';

  pool.query(checkQuery, [ip_address], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    // If the result is not empty, it means there is a matching record
    if (results.length > 0) {
      return res.status(400).json({ error: 'Data already exists for this IP address' });
    }

    // Continue with your logic if no matching record is found
    // ...

    // Send a success response if needed
    return res.status(200).json({ success: true });
  });
});


let previousTotalConsumed = null;

// FOR REGISTER
app.post('/storeTotalConsumed', (req, res) => {
  const { totalConsumed } = req.body;

  // Check if the value has changed before storing
  if (totalConsumed !== previousTotalConsumed) {
    // Check if a record with ID 1 exists
    pool.query('SELECT * FROM logs_consumed WHERE id = ?', [1], (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error checking for existing record:', selectErr);
        res.status(500).json({ error: 'Error checking for existing record.' });
        return;
      }

      if (selectResults.length > 0) {
        // Update the existing record with ID 1
        pool.query('UPDATE logs_consumed SET total_value = ? WHERE id = ?', [totalConsumed, 1], (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating total consumed data:', updateErr);
            res.status(500).send('Error updating total consumed data');
            return;
          }

          console.log('Total consumed data updated:', totalConsumed);

          // Update the previous total consumed value
          previousTotalConsumed = totalConsumed;

          // Insert/update into the "updated" table
          pool.query('INSERT INTO updated (id, consumed) VALUES (?, ?) ON DUPLICATE KEY UPDATE consumed = ?', [1, totalConsumed, totalConsumed], (insertErr, insertResults) => {
            if (insertErr) {
              console.error('Error inserting/updating total consumed data in the updated table:', insertErr);
              res.status(500).send('Error inserting/updating total consumed data in the updated table');
              return;
            }

            console.log('Total consumed data stored/updated in the updated table:', totalConsumed);
            res.sendStatus(200);
          });
        });
      } else {
        // Insert a new record with ID 1 in logs_consumed
        pool.query('INSERT INTO logs_consumed (id, total_value) VALUES (?, ?)', [1, totalConsumed], (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error inserting total consumed data:', insertErr);
            res.status(500).send('Error inserting total consumed data');
            return;
          }

          console.log('Total consumed data stored:', totalConsumed);

          // Update the previous total consumed value
          previousTotalConsumed = totalConsumed;

          // Insert into the "updated" table
          pool.query('INSERT INTO updated (id, consumed) VALUES (?, ?)', [1, totalConsumed], (insertErr, insertResults) => {
            if (insertErr) {
              console.error('Error inserting total consumed data into the updated table:', insertErr);
              res.status(500).send('Error inserting total consumed data into the updated table');
              return;
            }

            console.log('Total consumed data stored in the updated table:', totalConsumed);
            res.sendStatus(200);
          });
        });
      }
    });
  } else {
    console.log('Total consumed data unchanged. Skipping storage.');
    res.sendStatus(200);
  }
});


app.post('/resetTotalConsumed', (req, res) => {
  // Perform logic to reset totalConsumed
  totalConsumed = 0;
  console.log('Total consumed data reset successfully for a new day.');
  res.sendStatus(200);
});

// Retrieve all data from logs_consumed except id
app.get('/getAllLogsConsumed', (req, res) => {
    pool.query('SELECT DateAdd, startingrefills, total_value, remaining_refills FROM logs_consumed', (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error retrieving logs_consumed data:', selectErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (!selectResults || selectResults.length === 0) {
        // Handle case where no data is found
        return res.status(404).json({ error: 'No data found.' });
      }
  
      res.status(200).json(selectResults);
    });
  });


  app.get('/getAllGallons', (req, res) => {
    pool.query('SELECT Date, gallons FROM add_containers', (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error retrieving logs_consumed data:', selectErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (!selectResults || selectResults.length === 0) {
        // Handle case where no data is found
        return res.status(404).json({ error: 'No data found.' });
      }
  
      res.status(200).json(selectResults);
    });
  });

  
  app.get('/UpdatedGallons', (req, res) => {
    pool.query('SELECT Date, gallons, consumed, remaining FROM updated', (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error retrieving logs_consumed data:', selectErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (!selectResults || selectResults.length === 0) {
        // Handle case where no data is found
        return res.status(404).json({ error: 'No data found.' });
      }
  
      res.status(200).json(selectResults);
    });
  });
  app.get('/getTotalConsumed', (req, res) => {
    const { id, total_value } = req.body; // Assuming you are passing id and total_value in the request body
  
    // Constructing the SQL query with a WHERE clause
    const sqlQuery = 'SELECT total_value FROM logs_consumed WHERE id = ? AND total_value = ?';
  
    // Using placeholder values to prevent SQL injection
    pool.query(sqlQuery, [id, total_value], (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error retrieving logs_consumed data:', selectErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (!selectResults || selectResults.length === 0) {
        // Handle case where no data is found
        return res.status(404).json({ error: 'No data found.' });
      }
  
      res.status(200).json(selectResults);
    });
  });
  
  
  app.post('/getTotalValue', async (req, res) => {
    const { totalValue } = req.body;
    try {
        const connection = await pool.getConnection();
        const selectResults = await connection.query('SELECT * FROM logs_consumed WHERE total_value = ?', [totalValue]);
        connection.release(); // Release the connection when done

        console.log('Total value is retrieved');
        res.json(selectResults);
    } catch (selectErr) {
        console.error('Error checking for existing record:', selectErr);
        res.status(500).json({ error: 'Error checking for existing record.' });
    }
});



app.get('/totalGallons', (req, res) => {
  pool.query('SELECT gallons_total FROM gallons_total', (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error', selectErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!selectResults || selectResults.length === 0) {
      // Handle case where no data is found
      return res.status(404).json({ error: 'No data found.' });
    }

    const totalGallons = selectResults[0].gallons_total; // Assuming there is only one result
    res.status(200).json({ totalGallons });
  });
});


app.post('/AddContainer', (req, res) => {
  const { startingrefills, containers } = req.body;
  const insertQuery1 = `INSERT INTO logs_consumed (startingrefills) VALUES (?)`;

  pool.query(insertQuery1, [startingrefills], (err1, result1) => {
    if (err1) {
      console.error('Error inserting data into logs_consumed: ' + err1.stack);
      res.status(500).send('Error inserting data into logs_consumed');
      return;
    }

    console.log('Data inserted successfully into logs_consumed');

    const insertQuery2 = `INSERT INTO addWater (containers) VALUES (?)`;
    pool.query(insertQuery2, [containers], (err2, result2) => {
      if (err2) {
        console.error('Error inserting data into addWater: ' + err2.stack);
        res.status(500).send('Error inserting data into addWater');
        return;
      }

      console.log('Data inserted successfully into addWater');
      // Send response after both queries have been executed
      res.status(200).send('Data inserted successfully into both tables');
    });
  });
});

  
app.post('/addToMySQL', (req, res) => {
  const { textBoxValue } = req.body;

  // Use CURRENT_TIMESTAMP directly in the SQL query
  const sql = 'INSERT INTO add_containers (gallons) VALUES (?)';

  pool.query(sql, [textBoxValue], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Error inserting data into MySQL' });
    } else {
      console.log('Data inserted into MySQL successfully');
      res.status(200).json({ message: 'Data inserted into MySQL successfully' });
    }
  });
});


app.post('/calculateTotalGallons', (req, res) => {
  const { sum_gallons } = req.body;
  pool.query('SELECT SUM(gallons) AS total_gallons FROM add_containers', (err, result) => {
    if (err) {
      console.error('Error calculating total gallons:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const sum_gallons = result[0].total_gallons;

      pool.query(
        'INSERT INTO gallons_total (id, gallons_total) VALUES (?, ?) ON DUPLICATE KEY UPDATE gallons_total = ?',
        [1, sum_gallons, sum_gallons],
        (err) => {
          if (err) {
            console.error('Error inserting into aggregated_result table:', err);
            res.status(500).send('Internal Server Error');
          } else {
            res.status(200).json({ totalGallons: sum_gallons });
          }
        }
      );
      
    }
  });
});

app.get('/gallonstotal', (req, res) => {
  pool.query('SELECT gallons_total FROM gallons_total', (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error', selectErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!selectResults || selectResults.length === 0) {
      // Handle case where no data is found
      return res.status(404).json({ error: 'No data found.' });
    }

    const totalGallons = selectResults[0].gallons_total; // Assuming there is only one result
    res.status(200).json({ totalGallons });
  });
});

app.get('/consumed', (req, res) => {
  pool.query('SELECT consumed FROM updated', (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error', selectErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!selectResults || selectResults.length === 0) {
      // Handle case where no data is found
      return res.status(404).json({ error: 'No data found.' });
    }

    const totalCons= selectResults[0].consumed; // Assuming there is only one result
    res.status(200).json({ totalCons });
  });
});

app.get('/gallonsRemaining', (req, res) => {
  // Update the 'remaining' column in the 'updated' table
  pool.query('UPDATE updated SET remaining = gallons - consumed', (updateErr, updateResults) => {
    if (updateErr) {
      console.error('Error updating remaining', updateErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Select the updated 'remaining' value
    pool.query('SELECT remaining FROM updated', (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error selecting remaining', selectErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (!selectResults || selectResults.length === 0) {
        // Handle case where no data is found
        return res.status(404).json({ error: 'No data found.' });
      }

      const totalRemaining = selectResults[0].remaining; // Assuming there is only one result
      res.status(200).json({ totalRemaining });
    });
  });
});


app.post('/updateRemaining', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE updated SET remaining = gallons - consumed'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/add', (req, res) => {
  // Step 2: Retrieve data from source_table where id is 1
  pool.query(
    'SELECT gallons_total FROM gallons_total WHERE id = 1',
    
    (err, results) => {
      if (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const retrievedData = results[0].gallons_total;
        console.log('Retrieved data:', retrievedData);

        // Step 3: Insert data into destination_table
        const destinationTable = 'updated';

        if (retrievedData) {
          pool.query(
            'UPDATE ?? SET gallons = ? WHERE id = 1',
            [destinationTable, retrievedData],
            (err, results) => {
              if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send('Internal Server Error');
              } else {
                console.log('Data inserted into destination_table');
                res.send('Data inserted successfully');
              }
            }
          );
        } else {
          res.status(404).send('Data not found');
        }
      }
    }
  );
});


app.delete('/deleteGallon/:date', (req, res) => {
  const itemDate = parseInt(req.params.date);

  // Find the index of the item with the specified ID
  const index = logsConsumedData.findIndex((item) => item.date === itemDate);

  if (index !== -1) {
    // If the item exists, remove it from the array
    logsConsumedData.splice(index, 1);
    res.sendStatus(204); // No content (successful deletion)
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});
// FOR DELETE
// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    pool.query('DELETE FROM users WHERE id = ?', [userId]);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/updateLimit', async (req, res) => {
  const { ipAddress, limit } = req.body;

  try {
    // Get a connection from the pool
    const result = await pool.query('UPDATE users SET `limit` = ? WHERE `ip_address` = ?', [limit, ipAddress]);

    // Check if the query was successful
    if (result.affectedRows > 0) {
      // Send a response indicating success
      res.json({ success: true, message: 'Limit updated in the database' });
      console.log('Limit successfully updated in the database');
    } else {
      // If no rows were affected, it means the IP address was not found
      res.status(404).json({ success: false, message: 'IP address not found in the database' });
      console.log('IP address not found in the database');
    }
  } catch (error) {
    console.error('Error updating limit in the database:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});