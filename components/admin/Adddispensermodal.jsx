
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';



function App() {
    const [ipAddress, setIpAddress] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [ipError, setIpError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [displayDisp, setDisplayDisp] = useState(true);
    const [dispenserData, setDispenserData] = useState({});
    const [dispImported, setDispImported] = useState(false);
    const [modal, setModal] = useState(false);
    const [ipandlocation, setipandlocation] = useState(false);
    const [checknullwc, setchecknull] = useState(false);
    const [enteredIpAddress, setEnteredIpAddress] = useState('');
    const [location, setLocation] = useState('');
    const [locationError, setLocationError] = useState('');

    
    const [initialSetup, setinitialSetup] = useState(true);


    //////websocket
    const [socket, setSocket] = useState(null);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [locationIPMap, setLocationIPMap] = useState({});
    const [selectedLocationIP, setSelectedLocationIP] = useState('');
  
    useEffect(() => {
      const serverUri = 'ws://localhost:8080/';
      const webSocket = new WebSocket(serverUri);
  
      webSocket.onopen = () => {console.log('WebSocket connection opened');};
      webSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        console.log(`Received data: ${JSON.stringify(receivedData)}`);
  
        const updatedIPMap = { ...locationIPMap };
        receivedData.forEach(({ Location, IpAddress }) => {
          updatedIPMap[Location] = IpAddress;
        });
  
        setLocations(Object.keys(updatedIPMap));
        setLocationIPMap(updatedIPMap);
      };
      webSocket.onclose = () => console.log('WebSocket connection closed');
      webSocket.onerror = (error) => console.error(`WebSocket error: ${error}`);
  
      setSocket(webSocket);
  
      return () => {
        if (webSocket.readyState === WebSocket.OPEN || webSocket.readyState === WebSocket.CONNECTING) {
          webSocket.close();
        }
      };
    }, [locationIPMap]);

 

  
    const sendMessage = (message) => socket?.send(message);
  
    const handleLocationChange = (event) => {
      const location = event.target.value;
      setSelectedLocation(location);
  
      const ip = locationIPMap[location];
      setSelectedLocationIP(ip);
  
      // Store the IP address to the database
      sendMessage(JSON.stringify([{ Location: location, IpAddress: ip }]));
    };
  
    const handleClick = () => {
      sendMessage('Get Location');
    };
    
    //////


    const handleIpAddressChange = (e) => {
        const enteredIp = e.target.value;
        setIpAddress(enteredIp);

        const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

        if (!ipRegex.test(enteredIp)) {
            setIpError('Enter a valid IP address');
        } else {
            setIpError('');
        }
        const checkForDuplicateIP = async (ip) => {
            try {
              const response = await fetch('http://localhost:3001/checkDuplicate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ip_address: ip }),
              });
          
              if (response.ok) {
                const data = await response.json();
                if (data.duplicate) {
                  setIpError('IP address already exists');
                } else {
                  setIpError('');
                }
                const enteredLocation = location;
                if (!enteredLocation.trim()) {
                    setLocationError('Enter a location');
                } else {
                    setLocationError('');
                }
              } else {
                console.error('Error checking IP existence:', response.statusText);
                setIpError('Error checking IP existence');
              }
            } catch (error) {
              console.error('Error checking IP existence:', error);
              setIpError('Error checking IP existence');
            }
          };
    };

    async function fetchData(cons,water) {
        try {
      
          // Make a POST request to the /checknull endpoint
          const response = await fetch('http://localhost:3000/checknull', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip_address: ip, water_level: water, consumed: cons }),
          });
      
          // Check if the response status is OK (200)
          if (response.ok) {
            // Parse the JSON response
            const data = await response.json();
      
            // Check if 'consumed' and 'water_level' are null in the response
            if (data.consumed === 'NULL' && data.water_level === 'NULL') {
              setchecknull(true);
            }
      
            // Log or process the data as needed
            console.log(data);
          } else {
            // If the response status is not OK, handle the error
            const errorData = await response.json();
            console.error('Error:', errorData.error);
          }
        } catch (error) {
          // Handle any errors that may occur during the fetch operation
          console.error('Fetch error:', error);
        }
      }

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ip_address: selectedLocationIP, location: selectedLocation, location}),
            });
              if(selectedLocationIP === '')
            setIPerror('Please answer the question')

            if (response.ok) {
                
                console.log('User registered successfully!');
                setRegisteredUsers([...registeredUsers, { ip: selectedLocationIP, location:selectedLocation, location }]);
               
                // setIpAddress('');
                // setLocation('');
                setModal(true);
                toggleModal();
                
            
                setRegistrationSuccess(true);
            } else {
                console.error('Error registering user.');
                setRegistrationSuccess(false);
                
            }
        } catch (error) {
            console.error('Error:', error);
            setRegistrationSuccess(false);
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        setRegistrationSuccess(false);
        setIpError('');
        
      sendMessage('Get Location'); 
        
    };

    const customModalStyles = {
        content: {
            width: '30%',
            height: '60%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'dirty white',
            border: '2px solid black',
        },
    };

    const ModalIPRegistered = {
        content: {
            width: '30%',
            height: '18%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontWeight: 'Bold',
        },
    };

    const buttonAdd = (
        <button onClick={toggleModal} style={{fontWeight:'bold'}}>
            {showModal ? 'Close' : 'Add Water Dispenser Device'}
        </button>
    );
    
  
    return (     
        <div className="App">
            <div>{buttonAdd}</div>
            <Modal
                isOpen={showModal}
                onRequestClose={toggleModal}
                contentLabel="Registration"
                style={customModalStyles}
            >
                <div>
                    <h5>Add Water Dispenser Device</h5>
                </div>
                
                <div className="container mt-1">
               
                <button className="btn btn-primary mb-3" onClick={handleClick}>Rescan Devices</button>

                <div className="form-group">
                <label htmlFor="locationDropdown">Select Device:</label>
                <select className="form-control" id="locationDropdown" value={selectedLocation} onChange={handleLocationChange}>
                  <option value="" disabled>Select a device</option>
                  {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                  ))}
                </select>
                </div>
                <div >
                <label>Location: </label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={{ display: 'flex', flexDirection: 'column' }} />
                </div>
		 
		</div>

                {registrationSuccess && (
    <div style={{ color: 'green', textAlign: 'center' }}>
        Registered successfully!
    </div>
)}
              <div style={{ alignSelf: 'flex-end' }}>
                <button onClick={async () => { await handleSubmit(); }} disabled={!!ipError}>
                        Register
                    </button>
                </div>
                <button style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={toggleModal}>
                    Close
                </button>
               
            </Modal>


{/*IP IS REGISTERED*/}
            <Modal
  isOpen={modal}
  onRequestClose={() => setModal(false)}
  contentLabel="IP Registered"
  style={ModalIPRegistered}
>
  <div style={{ textAlign: 'center' }}>
    <p>IP successfully registered!</p>
    <button onClick={() => setModal(false)}>Close</button>
  </div>
</Modal>
{/*IP AND LOCATION NOT FOUND MODAL*/}
<Modal
  isOpen={ipandlocation}
  onRequestClose={() => setipandlocation(false)}
  contentLabel="IP and Location not Found"
  style={ModalIPRegistered}
>
  <div style={{ textAlign: 'center' }}>
    <p>NOT FOUND!</p>
    <button onClick={() => setipandlocation(false)}>Close</button>
  </div>
</Modal>
{/*MODAL for consumed and water-level*/}
<Modal
  isOpen={checknullwc}
  onRequestClose={() => setchecknull(false)}
  contentLabel="not Found"
  style={ModalIPRegistered}
>
  <div style={{ textAlign: 'center' }}>
    <p>NOT FOUND!</p>
    <button onClick={() => setchecknull(false)}>Close</button>
  </div>
</Modal>
        </div>
       
    );

    
}

export default App;