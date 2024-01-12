import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from '../../styles/Home.module.css';
import { toast } from 'react-toastify';  // Import toast from react-toastify


import Modal from 'react-modal';

const Disp = ({ data, onUpdate }) => {
  if (!data || (!Array.isArray(data) && !Array.isArray(data.data))) {
    // Handle the case where data is not an array (you might want to customize this based on your requirements)
    return <p>No data available</p>;

    
  
  }

  const calculateRemainingRefills = (totalRefills, consumedRefills) => {
    return totalRefills - consumedRefills;
  };

  

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const updatedData = Array.isArray(data)
        ? data.filter((item) => item.id !== id)
        : data.data.filter((item) => item.id !== id);

      setData(updatedData);

      if (updatedData.some(item => item.water_level === "LOW")) {
        // Display toast message when water level is LOW
        toast.warning("REFILL NEEDED!", {
          position: toast.POSITION.TOP_CENTER
        });
      }

      setDisplayDelete(false);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  const handleEdit = (id) => {
    const newLocation = window.prompt('Enter new location:');
    const newIpAddress = window.prompt('Enter new IP address:');

    // Check if both location and IP address are provided
    if (newLocation && newIpAddress) {
      onUpdate(id, newLocation, newIpAddress);
    }
  };

  const dataArray = Array.isArray(data) ? data : data.data;

  const [displayDelete, setDisplayDelete] = useState(false);
  
  
  const ModalDelete = {
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

 return (
    <div className=" col-lg-12 col-md-12 p-4">
      <div className="card-group" style={{display:'flex'
    ,  gap: '25px'}}>
        {dataArray.map((value) => (
          <div className="col-lg-3 col-md-4 mb-4"  key={value.id}>
          <div className = "card text-white card bg-danger mb-3">
           <div className="card bg-light" style={{ marginBottom: '10px'}}>
           <div class="card-header " style={{
            backgroundColor: "#565151",
            color: "white",
            width: "100%",
            height: "20%",
            marginTop: "10%",
            padding: "10px 10px",
            textAlign: "center",
            fontSize: "20px"
                     }}>{value.location}</div>
            <div className="card-title fs-6 text-center bg-dark text-white">{value.ip_address}</div>
                <div className="card-body " style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <div className=" text-center" style={{marginTop:'-25px'}}>Status:
                  <span id="status"></span>
                  <div className="d-flex justify-content-between mt-1 mb-1">
                    <div style={{marginLeft:'20px'}}><h5>HIGH</h5></div>
                   <img 
  src={value.water_level === "HIGH" ? "/HIGH_GALLON.png" : "/NO_GALLON.png"} // Adjust the path and filename based on your data structure
  alt="H" // Provide an appropriate alt text
  style={{ width: "50px", height: "60px" , marginTop:'-5%', marginRight:'20px',  display: 'block'}} // Adjust the style as needed
/>

                    <h5>LOW</h5>
                    <img 
  src={value.water_level === "LOW" ? "/LOW_GALLON.png" : "/NO_GALLON.png"} // Adjust the path and filename based on your data structure
  alt="H" // Provide an appropriate alt text
  style={{ width: "50px", height: "60px" , marginTop:'-5%', marginRight:'20px', display: 'block'}} // Adjust the style as needed
/>
</div>
</div>
                <div className="card-text" style={{textAlign:'center'}}>
                  <strong>Consumed:</strong>{" "}
                  <span id="label">{value.consumed}</span>
                </div>
                <div className="card-text" style={{textAlign:'center'}}>
                 
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}> 
                <button type="button" class="btn btn-secondary mt-2 mr-3" onClick={() => handleEdit(value.id)}>Edit</button>
                <button type="button" class="btn btn-danger mt-2" onClick={() => {setDisplayDelete(true)}}>Delete</button> </div>
    <Modal
  isOpen={displayDelete}
  onRequestClose={() => setDisplayDelete(false)}
  contentLabel="Delete"
  style={ModalDelete}
>
  <div>
    <p>Delete Water Dispenser?</p>
    <button className="btn btn-danger"
      style={{ marginRight: '50px' }}
      onClick={() =>{handleDelete(value.id); setDisplayDelete(false)}}
    >
      Yes
    </button>
    <button className="btn btn-dark" style={{ marginRight:'50px' }} onClick={() => setDisplayDelete(false)}>No</button>
  </div>
</Modal>
       
            
            </div>
          </div>
          </div>
          </div>
        ))}
      </div>
      {/*Are you sure? Delete*/}
      <div style={{ margin:'20px' }}></div>
    </div>
    
  );

};
const Home = () => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalConsumed, setTotalConsumed] = useState(0);

  const fetchData = () => {
    fetch("http://localhost:3002/stuffs")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((responseData) => {
        if (responseData && (Array.isArray(responseData) || Array.isArray(responseData.data))) {
          setData(responseData);
          // Calculate total consumed data
          const newTotalConsumed = responseData.reduce((acc, value) => acc + value.consumed, 0);
          setTotalConsumed(newTotalConsumed);
  
          // Store total consumed data
          storeTotalConsumed(newTotalConsumed);
  
          setLoading(false);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      });
  };
  
  const updateData = async (id, newLocation, newIpAddress) => {
    try {
      await fetch(`http://localhost:3002/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: newLocation, ip_address: newIpAddress }),
      });

      // Update local data after successful update
      const updatedData = data.map((item) => (item.id === id ? { ...item, location: newLocation, ip_address: newIpAddress } : item));
      setData(updatedData);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const storeTotalConsumed = async (totalConsumed) => {
    try {
      await fetch("http://localhost:3001/storeTotalConsumed", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalConsumed }),
      });
      console.log('Total consumed data stored successfully.');
    } catch (error) {
      console.error('Error storing total consumed data:', error);
    }
  };

  

  useEffect(() => {
    fetchData(); // Initial data fetch

    // Set up an interval to fetch updated data every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      
      <div className="row">
   
    <div className="col-lg-7 col-md-12">
      <div className="position-flex fs-4 bg-white"
      style={{marginTop:'20px', border:'2px solid black'}}
      >Total Consumed: {totalConsumed}</div> 
          </div>
        
        <Disp data={data} onUpdate={updateData} /> {/* Pass the onUpdate prop */}
        {/* Display total consumed data outside the Disp component */}
        
          <div style={{display:'flex'}}>
            
        </div>
      </div>
    </div>
  );
};

export default Home;