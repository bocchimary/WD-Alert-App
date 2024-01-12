
// ScanComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScanComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3002/scan');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h1>Data from localhost:3002/scan</h1>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Fetching Data...' : 'Fetch Data'}
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <strong>SSID:</strong> {item.ssid}, <strong>MAC:</strong> {item.mac}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScanComponent;
