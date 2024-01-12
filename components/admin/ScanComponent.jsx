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
      const response = await axios.get('http://localhost:3004/scan');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const connectToNetwork = async (ssid, mac) => {
    try {
      // Assuming you have an endpoint for connecting to the network
      const response = await axios.post('http://localhost:3004/connect', { ssid, mac });
      console.log('Connection successful:', response.data);
      alert(`Connected to network: ${ssid}`);
      
      // Open the link in a new tab after successful connection
      window.open('http://192.168.4.1', '_blank');
    } catch (error) {
      console.error('Error connecting to network:', error.message);
      alert(`Failed to connect to network: ${ssid}`);
    }
  };

  const handleItemClick = (item) => {
    // Connect to the network with real connection logic
    connectToNetwork(item.ssid, item.mac);
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="display-4 custom-heading">
        Scan Available Devices to Connect
      </h1>    
      <button className="btn btn-info" onClick={fetchData} disabled={loading}>
        {loading ? 'Fetching Data...' : 'Scan Devices'}
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          {data
          .filter((item) => item.ssid.includes('WDAS'))
          .map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  margin: '5px',
                  cursor: 'pointer',
                }}
              >
                <strong>SSID:</strong> {item.ssid}, <strong>MAC:</strong> {item.mac}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ScanComponent;
