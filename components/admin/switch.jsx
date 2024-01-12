// src/Settings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [setTimer, setSetTimer] = useState(null);
  const [turnOffTimer, setTurnOffTimer] = useState(null);
  const [switchResponses, setSwitchResponses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [timerConditionMet, setTimerConditionMet] = useState(false);
  const [turnOffTimerConditionMet, setTurnOffTimerConditionMet] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/stuffs");
        const data = response.data.map((stuff) => ({
          ipAddress: stuff.ip_address,
          location: stuff.location,
        }));
        setSettings(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    fetchData();
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const updateSwitches = async () => {
      const responses = [];

      settings.forEach(async (setting) => {
        const { ipAddress } = setting;

        // Turn on the switch
        if (setTimer && currentTime >= setTimer) {
          try {
            const response = await updateSwitchStatus(ipAddress, true);
            responses.push({ ipAddress, response });
          } catch (error) {
            console.error(
              `Error updating switch status for ${ipAddress}:`,
              error
            );
          }
        }

        // Turn off the switch
        if (turnOffTimer && currentTime >= turnOffTimer) {
          try {
            const response = await updateSwitchStatus(ipAddress, false);
            responses.push({ ipAddress, response });
          } catch (error) {
            console.error(
              `Error updating switch status for ${ipAddress}:`,
              error
            );
          }
        }
      });

      setSwitchResponses(responses);
      setSuccessMessage("All switches set successfully.");
    };

    updateSwitches();
  }, [currentTime, settings]);

  const updateSwitchStatus = async (ipAddress, newSwitchState) => {
    try {
      const response = await axios.post(`http://${ipAddress}/setparams`, {
        switch: newSwitchState ? 1 : 0,
      });
      return response.data; // Assuming the response contains relevant information
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container">
      <div className="clock display-4 mt-3 mb-3">
        {currentTime.toLocaleTimeString()}
      </div>
      <div className="d-flex gap-3">
        {settings.map((setting) => (
          <CardSettings key={setting.ipAddress} setting={setting} />
        ))}
      </div>
      <div>
        {switchResponses.map((response, index) => (
          <div
            key={index}
          >{`Switch at ${response.ipAddress}: ${response.response}`}</div>
        ))}
      </div>
    </div>
  );
};

// Apptime component definition
const Apptime = ({ ipAddress }) => {
  const [morningTime, setMorningTime] = useState("05:00");
  const [eveningTime, setEveningTime] = useState("19:00");

  const handleUpdateTimes = async () => {
    try {
      const response = await axios.post(`http://${ipAddress}/update-times`, {
        morningTime: morningTime,
        eveningTime: eveningTime,
      });
      console.log(response.data);
      alert("Times updated successfully!");
    } catch (error) {
      console.error("Error updating times:", error);
      alert("Failed to set the time. Please try again.");
    }
  };

  return (
    <div
      style={{
        margin: "auto",
        textAlign: "center",
      }}
    >
      <label style={{ marginRight: "13px" }}>DEVICE(ON): </label>
      <input
        type="time"
        value={morningTime}
        onChange={(e) => setMorningTime(e.target.value)}
      />
      <br />
      <div style={{ marginTop: "10px", marginBottom: '7px' }}>
        <label style={{ marginRight: "6px" }}>DEVICE(OFF): </label>
        <input
          type="time"
          value={eveningTime}
          onChange={(e) => setEveningTime(e.target.value)}
        />
      </div>
      <button
        onClick={handleUpdateTimes}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "5px",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        SET TIME
      </button>
    </div>
  );
};

// CardSettings component definition
const CardSettings = ({ setting }) => {
  const { ipAddress, location } = setting;
  const [switchState, setSwitchState] = useState(false);
  const [time, setTime] = useState(0);

  const updateSettings = async () => {
    try {
      const response = await axios.post(`http://${ipAddress}/setparams`, {
        switch: switchState ? 1 : 0,
        time,
      });

      console.log(response.data);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleSwitchChange = async () => {
    setSwitchState(!switchState);
    await updateSettings();
  };

  return (
    <div
      className="card"
      style={{
        width: "250px",
        height: "250px",
        border: "2px solid black",
        textAlign: "center",
        alignItems: "center",
        backgroundColor: "#d9d9d9",
      }}
    >
      <h4 className="card-title bg-dark text-white p-2 mb-2">
        Location: {location}
      </h4>
      <label className="form-label">Switch:</label>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={switchState}
          onChange={handleSwitchChange}
        />
        {switchState && <span className="text-success">✔</span>}
      </div>

      {/* Render Apptime component with the specific ipAddress */}
      <Apptime ipAddress={ipAddress} />
    </div>
  );
};

export default Settings;
