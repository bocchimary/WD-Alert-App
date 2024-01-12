import React, { useState, useEffect } from 'react';

const GallonsTotalComponent = () => {
  const [totalGallons, setTotalGallons] = useState(null);
  const [totalRemaining, setTotalRemaining] = useState(null);
  const [totalCons, setTotalCons] = useState(null);

 
  const fetchData = () => {
    fetch('http://localhost:3001/gallonstotal')
      .then(response => response.json())
      .then(data => setTotalGallons(data.totalGallons))
      .catch(error => console.error('Error fetching total gallons:', error));

    fetch('http://localhost:3001/gallonsRemaining')
      .then(response => response.json())
      .then(data => setTotalRemaining(data.totalRemaining))
      .catch(error => console.error('Error fetching total remaining:', error));

    fetch('http://localhost:3001/consumed')
      .then(response => response.json())
      .then(data => setTotalCons(data.totalCons))
      .catch(error => console.error('Error fetching total consumed:', error));
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Fetch data every 10 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchData, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
            <div className="d-flex justify-content-center align-items-center">
            <div className="card-deck d-flex" style={{ gap: '20px' }}>
                <div className="card">
                    <div className="card-content">
                        <h4 className="card-title">Total Gallons</h4>
                        {totalGallons !== null ? (
        <h1 className="card-text text-black">{totalGallons}</h1>
      ) : (
        <p>Loading...</p>
      )}    
                    </div>
                </div>
                <div className="card" >
                    <div className="card-content">
                        <h4 className="card-title">Updated Gallons</h4>
                        {totalRemaining !== null ? (
        <h1 className="card-text text-black">{totalRemaining}</h1>
      ) : (
        <p>Loading...</p>
      )}    
                
                    </div>
                </div>

                <div className="card" >
                    <div className="card-content">
                        <h4 className="card-title">Consumed</h4>
                        {totalCons !== null ? (
        <h1 className="card-text text-black">{totalCons}</h1>
      ) : (
        <p>Loading...</p>
      )}    
                    </div>
                </div>
                
            </div>
        </div>
   
    </div>
  );
};

export default GallonsTotalComponent;
