import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Dashboard from '../components/students/students';
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";


const studentsDashboard = () => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>WDRAS for Students</title>
      </Head>
      <Navbar />
      <div style={{ background: 'linear-gradient(to bottom, #D61E1E, #ff9009)',   border: '2px solid black' }} >
      <div className = {styles.movingText} style={{ width:'100vh', marginTop:
    '10px', marginBottom: '-20px'
     }}>
  <h3>Welcome Students and Personnel!</h3>
  </div>
      <Dashboard user={{ role: 'student' }}/>
     </div>
    </div>
    
  );
};


export default studentsDashboard ;
