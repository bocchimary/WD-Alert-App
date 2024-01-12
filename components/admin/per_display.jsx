import React, { useState, useEffect } from 'react';

const GallonsTotalComponent = () => {
  const [totalGallons, setTotalGallons] = useState(null);
  const [totalRemaining, setTotalRemaining] = useState(null);
  const [totalCons, setTotalCons] = useState(null);
  useEffect(() => {
    // Fetch total gallons from the server
    fetch('http://localhost:3001/gallonstotal')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTotalGallons(data.totalGallons);
      })
      .catch(error => {
        console.error('Error fetching total gallons:', error);
      });

      fetch('http://localhost:3001/gallonsRemaining')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTotalRemaining(data.totalRemaining);
      })
      .catch(error => {
        console.error('Error fetching total gallons:', error);
      });

      fetch('http://localhost:3001/consumed')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTotalCons(data.totalCons);
      })
      .catch(error => {
        console.error('Error fetching total gallons:', error);
      });
       
  }, []); // Empty dependency array ensures that useEffect runs only once, similar to componentDidMount

  return (
    <div>
            <div className="d-flex justify-content-center align-items-center">
            <div className="card-deck d-flex" style={{ gap: '20px' }}>
               
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
