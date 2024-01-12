import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/bg.module.css'; // Adjust the relative path to match your project structure
import Disp from './dispenser';
import AddDisp from './Adddispensermodal';
import Limit from './limit';
import Inv from './inventory';
import InvButton from './invbutton';
import Addcon from './AddContainer';
import Switch from './switch';
import Scroll from './scrollableTable';
import InvCard from './inventoryCard';
import AddWater from './addWaterGallons';
import AddContainer from './AddContainer';
import Display from './display';
import TableAdd from './tableAdd';
import UpdatedTable from './updatedTable';
import UpdateButton from './updbtn';
import ConsumedTable from './consumedtable';
import RefillLogs from './refillLogs';
import ContainersAdded from './containersAdded';

function DaSteTimeComponent() {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    setActiveTab('Dashboard');
    // Function to update the full date and time
    function updateFullDateTime() {
      const now = new Date();
      const options = {
        welcomelekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      };
      const dateTimeString = now.toLocaleDateString(undefined, options);
      setCurrentDateTime(dateTimeString);
    }

    // Update the full date and time initially and every second
    updateFullDateTime(); // Call the function initially
    const intervalId = setInterval(updateFullDateTime, 1000); // Update every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="d-fixed position-absolute top-0 end-0 p-1">
      <p>{currentDateTime}</p>
    </div>
  );
}

export default function Dashboard({ user }) {
  const dateTimeContainerStyle = {
    position: 'relative',
    top: '20px',
    right: '20px',
    padding: '1px',
    
    color: 'black',
  };


  const [activeTab, setActiveTab] = useState('Dashboard');
  const [maxRefills, setMaxRefills] = useState(0); // State to store the maximum refills

  const [tabStyle, setTabStyle] = useState({
    Dashboard: {},
    RefillLogs: {},
    Change: {},
    Switch: {},
  });

  // Function to save the entered text to local storage
 

  // Function to handle changes in maximum refills
  const handleMaxRefillsChange = () => {
    // Implement the logic to change the maximum refills here
    console.log('Set maximum refills:', maxRefills);
  };

 
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Reset the background color for all tabs
    const resetTabStyle = Object.keys(tabStyle).reduce((acc, key) => {
      acc[key] = {};
      return acc;
    }, {});

    // Set the background color for the clicked tab
    setTabStyle({
      ...resetTabStyle,
      [tab]: {
        background: 'linear-gradient(90deg, rgba(180, 58, 58, 1) 0%, rgba(255, 72, 72, 1) 51%, rgba(255, 34, 9, 1) 100%)',
      },
    });
  };


  const renderSavedTexts = () => { 
    
  };

  const renderTabContent = () => {
    switch (activeTab) {
  
  
  
  
  case 'Dashboard':
      return (
        <div className="row justify-content-justify align-items-justify">
          <AddDisp />
          <Disp />

        </div>
      );


  case 'RefillLogs':
  
        return (
          <div style={{ textAlign: "center" }}>
       
            <h2>Refill Logs</h2>
          
            <div style={{ marginTop: "20px" }}>
              <Display />
             <div style={{ display:'flex', gap:'20px', marginTop:'20px' }}>
   <AddContainer />
   <ContainersAdded />


              </div>
 
       <RefillLogs />
            </div>
          </div>
        );
   

      case 'Change':
        return (
          <div>
            <h2 className="fw-bold fs-5">Set the Maximum Refills of each Dispenser</h2>
          <Limit />
          </div>
        );   
        case 'Switch':
          return (
            <div>
              <h2 className="fw-bold fs-5">Dispenser's Switches</h2>
             <Switch />
            </div>
          );
       
      }
  };

  return (
    <div className={styles.gradientBackground}> {/* Apply the CSS class here */}
      <div className="container-fluid mt-4">
        <div className="row" style={{diposition:'flex', width:'auto', height:'65vh'}}>
        <div className="col-md-3" style={{ borderRight: '3px solid #000000', borderBottom: '1px solid #000', borderTop: '1px solid #000'}}>
            <ul className="nav flex-column " id="myTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Dashboard' ? 'active' : ''}`}
                  id="Dashboard-tab"
                  data-toggle="tab"
                  href="#Dashboard"
                  role="tab"
                  aria-controls="Dashboard"
                  aria-selected={activeTab === 'Dashboard'}
                  onClick={() => handleTabClick('Dashboard')}
                  style={tabStyle.Dashboard}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Dashboard</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'RefillLogs' ? 'active' : ''}`}
                  id="RefillLogs-tab"
                  data-toggle="tab"
                  href="#RefillLogs"
                  role="tab"
                  aria-controls="RefillLogs"
                  aria-selected={activeTab === 'RefillLogs'}
                  onClick={() => handleTabClick('RefillLogs')}
                  style={tabStyle.RefillLogs}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Refill Logs</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Change' ? 'active' : ''}`}
                  id="Change-tab"
                  data-toggle="tab"
                  href="#Change"
                  role="tab"
                  aria-controls="Change"
                  aria-selected={activeTab === 'Change'}
                  onClick={() => handleTabClick('Change')}
                  style={tabStyle.Change}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Change Refill Number</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Switch' ? 'active' : ''}`}
                  id="Switch-tab"
                  data-toggle="tab"
                  href="#Switch"
                  role="tab"
                  aria-controls="Switch"
                  aria-selected={activeTab === 'Switch'}
                  onClick={() => handleTabClick('Switch')}
                  style={tabStyle.Switch}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Dispenser Switch</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-9" style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', paddingTop: '20px'}}>
            <div style={{ marginLeft: '50px',display: 'relative' }}>
              {renderTabContent()}
            </div>
            {activeTab === 'Dashboard' 
            
            }
         
          </div>
        </div>
      </div>

    </div>
  );
}