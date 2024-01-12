import React, { useState, useEffect } from 'react';

const WebSocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [receivedLocations, setReceivedLocations] = useState([]);

  useEffect(() => {
    const serverUri = 'ws://localhost:8080/';
    const webSocket = new WebSocket(serverUri);

    webSocket.onopen = () => console.log('WebSocket connection opened');
    webSocket.onmessage = (event) => {
      const receivedLocation = event.data;
      console.log(`Received location: ${receivedLocation}`);
      setReceivedLocations((prev) => [...prev, receivedLocation]);
    };
    webSocket.onclose = () => console.log('WebSocket connection closed');
    webSocket.onerror = (error) => console.error(`WebSocket error: ${error}`);

    setSocket(webSocket);

    return () => {
      if (webSocket.readyState === WebSocket.OPEN || webSocket.readyState === WebSocket.CONNECTING) {
        webSocket.close();
      }
    };
  }, []);

  useEffect(() => {
    const uniqueLocations = [...new Set(receivedLocations)];
    setLocations(uniqueLocations);
  }, [receivedLocations]);

  const sendMessage = (message) => socket?.send(message);

  const handleLocationChange = (event) => setSelectedLocation(event.target.value);

  const handleClick = () => {
    sendMessage('Get Location');
  };

  return (
    <div>
      <h1>WebSocket Location Example</h1>
      <button onClick={handleClick}>Get Location</button>

      <div>
        <h2>Received Locations:</h2>
        {receivedLocations.map((location, index) => (
          <div key={index}>{location}</div>
        ))}
      </div>

      <div>
        <label htmlFor="locationDropdown">Select Location:</label>
        <select id="locationDropdown" value={selectedLocation} onChange={handleLocationChange}>
          <option value="" disabled>Select a location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WebSocketComponent;
