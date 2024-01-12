import React, { useState, useEffect } from "react";

const App = () => {
  const [limitNum, setLimitNum] = useState(3);
  const [nodeMcuInfo, setNodeMcuInfo] = useState([]);

  useEffect(() => {
    const fetchNodeMcuInfo = async () => {
      try {
        const response = await fetch("http://localhost:3002/nodemcu-info");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("NodeMCU data:", data);

        // Ensure that data is an array, or convert a single object into an array
        const dataArray = Array.isArray(data) ? data : [data];

        setNodeMcuInfo(dataArray);
      } catch (error) {
        console.error("Error fetching NodeMCU info:", error);
      }
    };

    fetchNodeMcuInfo();
  }, []); // Run once on component mount

  const handleLimitChange = (event) => {
    setLimitNum(parseInt(event.target.value, 10));
  };

  const handleSubmit = async (event, ip) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://${ip}/update-limit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limitNum }),
      });

      if (response.ok) {
        console.log("Limit updated successfully");
      } else {
        console.error("Failed to update limit");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={containerStyle}>
      {nodeMcuInfo &&
        nodeMcuInfo.map((nodeMcu) => (
          <NodeMcuBox
            key={nodeMcu.location}
            nodeMcuInfo={nodeMcu}
            limitNum={limitNum}
            handleLimitChange={handleLimitChange}
            handleSubmit={(event) => handleSubmit(event, nodeMcu.ip)}
          />
        ))}
    </div>
  );
};

const NodeMcuBox = ({
  nodeMcuInfo,
  limitNum,
  handleLimitChange,
  handleSubmit,
}) => {
  return (
    <div style={boxStyle}>
      <h5>Location: {nodeMcuInfo.location}</h5>
      <form style={formStyle} onSubmit={handleSubmit}>
        <label style={labelStyle}>
          Limit:
          <input
            type="number"
            value={limitNum}
            onChange={handleLimitChange}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Set
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "row", // Horizontal direction
  flexWrap: "wrap", // Allows items to wrap to the next line if needed
};

const boxStyle = {
  border: "2px solid gray",
  padding: "10px",
  margin: "10px",
  width: "250px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  backgroundColor: "white",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const labelStyle = {
  marginBottom: "10px",
};

const inputStyle = {
  padding: "5px",
  marginBottom: "10px",
  width: '100px'
};

const buttonStyle = {
  padding: "8px",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
  border: "none",
  width: "100px",
};

export default App;
