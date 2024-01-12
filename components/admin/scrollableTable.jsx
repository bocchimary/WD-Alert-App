import React, { useState, useEffect } from 'react';

const LogsConsumedComponent = () => {
  const [logsConsumedData, setLogsConsumedData] = useState(null);
  const [ConsumedData, setConsumedData] = useState(null);


  useEffect(() => {
    // Fetch all data from logs_consumed from the server
    const fetchLogsConsumedData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getAllLogsConsumed');
        const data = await response.json();

        if (response.ok) {
          setLogsConsumedData(data);
          setConsumedData(data.total_value);
        } else {
          console.error('Error fetching logs_consumed data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching logs_consumed data:', error);
      }
    };

    fetchLogsConsumedData();
  }, []); // Run once on component mount  



  return (
    <div>
      <div>
  
        
      {logsConsumedData !== null && logsConsumedData.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(logsConsumedData[0]).map((key) => (
                <th key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logsConsumedData.map((log, index) => (
              <tr key={index}>
                {Object.values(log).map((value) => (
                  <td key={value} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    
                    {value}
                  </td>
                  
                ))}
               
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      <div>
    
      </div>
    </div>
    </div>
  );
};

export default LogsConsumedComponent;