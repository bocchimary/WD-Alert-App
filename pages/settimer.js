import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@/styles/Home.module.css";

function YourComponent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetTime, setTargetTime] = useState("");
  const [timeToken, setTimeToken] = useState(null);
  const [timeSet, setTimeSet] = useState(null);

  // Function to send a POST request with timeToken
  const sendPostRequest = async (token) => {
    try {
      // Replace '192.168.1.100/getwaterstatus' with the actual endpoint
      const response = await fetch("http://192.168.1.100/getwaterstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers as needed
        },
        body: JSON.stringify({ timeToken: token }),
      });

      // Handle the response as needed
      console.log("POST request sent:", response);
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // You may want to add validation for the user-inputted time
    // Convert the user-inputted time to a Date object
    const targetDate = new Date(`January 1, 2023 ${targetTime}`);
    setTargetTime(targetTime); // Update the state for rendering

    // Check if the current time matches the user-set time
    if (
      currentTime.getHours() === targetDate.getHours() &&
      currentTime.getMinutes() === targetDate.getMinutes()
    ) {
      sendPostRequest(0);
      setTimeToken(0);
    } else {
      setTimeToken(null); // Reset timeToken if the times don't match
    }

    // Always set the timeSet, regardless of the condition
    setTimeSet(targetTime);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      <p className="mt-3">Current Time: {currentTime.toLocaleTimeString()}</p>
      <div className="card mt-3">
        <div className="card-header">Set Time to Turn Off All Dispensers</div>
        <div className="card-body">
          <form onSubmit={handleFormSubmit} className="was-validated">
            <div className="mb-3">
              <label className="form-label">
                Set Target Time (HH:mm):
                <input
                  type="text"
                  className="form-control"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  placeholder="e.g., 07:00"
                />
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Set Time
            </button>
          </form>
        </div>
      </div>

      <p className="mt-3">
        Set Time: {timeSet} |{" "}
        {timeToken === 0
          ? "POST request sent with timeToken: 0"
          : ""}
      </p>
    </div>
  );
}

export default YourComponent;
