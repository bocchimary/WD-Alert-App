import React, { useState, useEffect } from 'react';

function App() {
  const [waterGallons, setWaterGallons] = useState([]);
  const [newGallon, setNewGallon] = useState({ name: '', quantity: 0 });

  useEffect(() => {
    // Fetch water gallons from the server
    fetch('http://localhost:3005/api/water-gallons')
      .then((response) => response.json())
      .then((data) => setWaterGallons(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const addGallon = () => {
    // Add a new water gallon to the server
    fetch('http://localhost:3005/api/water-gallons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGallon),
    })
      .then((response) => response.json())
      .then((data) => {
        setWaterGallons([...waterGallons, { id: data, ...newGallon }]);
        setNewGallon({ name: '', quantity: 0 });
      })
      .catch((error) => console.error('Error adding gallon:', error));
  };

  const updateGallon = (id, newQuantity) => {
    // Update the quantity of a water gallon on the server
    fetch(`http://localhost:3005/api/water-gallons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then(() => {
        setWaterGallons((gallons) =>
          gallons.map((gallon) =>
            gallon.id === id ? { ...gallon, quantity: newQuantity } : gallon
          )
        );
      })
      .catch((error) => console.error('Error updating gallon:', error));
  };

  const deleteGallon = (id) => {
    // Delete a water gallon from the server
    fetch(`http://localhost:3005/api/water-gallons/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setWaterGallons((gallons) => gallons.filter((gallon) => gallon.id !== id));
      })
      .catch((error) => console.error('Error deleting gallon:', error));
  };

  return (
    <div>
      <h1>Water Gallon Inventory</h1>
      <ul>
        {waterGallons.map((gallon) => (
          <li key={gallon.id}>
            {gallon.name} - Quantity: {gallon.quantity}
            <button onClick={() => updateGallon(gallon.id, gallon.quantity + 1)}>
              +1
            </button>
            <button onClick={() => updateGallon(gallon.id, gallon.quantity - 1)}>
              -1
            </button>
            <button onClick={() => deleteGallon(gallon.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newGallon.name}
          onChange={(e) => setNewGallon({ ...newGallon, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newGallon.quantity}
          onChange={(e) => setNewGallon({ ...newGallon, quantity: e.target.value })}
        />
        <button onClick={addGallon}>Add Gallon</button>
      </div>
    </div>
  );
}

export default App;
