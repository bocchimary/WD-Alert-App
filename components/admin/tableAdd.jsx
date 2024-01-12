import React, { useState, useEffect } from 'react';

const TableAdd = () => {
  const [logsConsumedData, setLogsConsumedData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchLogsConsumedData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getAllGallons');
        const data = await response.json();

        if (response.ok) {
          setLogsConsumedData(data);
        } else {
          console.error('Error fetching logs_consumed data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching logs_consumed data:', error);
      }
    };

    fetchLogsConsumedData();
  }, []);

  const openModal = () => {

    setModalOpen(true);

    const fetchLogsConsumedData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getAllGallons');
        const data = await response.json();

        if (response.ok) {
          setLogsConsumedData(data);
        } else {
          console.error('Error fetching logs_consumed data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching logs_consumed data:', error);
      }
    };

    fetchLogsConsumedData();
    
  };

  const closeModal = () => {
    setModalOpen(false);
  };





  const Modalstyles = () => {
    return {
      modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
      },
      modalContent: {
        background: '#fff', // white background for the modal content
        padding: '20px',
        maxWidth: '800px', // adjust the maximum width as needed
        width: '100%',
        maxHeight: '80%', // adjust the maximum height as needed
        overflowY: 'auto', // enable vertical scrolling if the content exceeds the modal height
      },
      closeBtn: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        fontSize: '20px',
      },
    };
  };
  
  const styles = Modalstyles();
  return (
    <div>
      <button className = "btn btn-danger"onClick={openModal}>Gallons Added</button>
      {isModalOpen && (
        <div style={styles.modal} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span  style={styles.closeBtn} onClick={closeModal}>
              &times;
            </span>
            {logsConsumedData !== null && logsConsumedData.length > 0 ? (
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
               <thead>
            <tr>
              {Object.keys(logsConsumedData[0]).map((key) => (
                <th key={key} style={{ border: '1px solid #ddd', padding: '8px'}}>
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
            
            {/*<td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <button onClick={() => handleDelete(index)}>Delete</button>
                </td> */}     
               
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
        )}
        </div>
      </div>
    )}
  </div>
);
};

export default TableAdd;



