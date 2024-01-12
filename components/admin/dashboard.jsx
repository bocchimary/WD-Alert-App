import React from 'react';
import DispModal from '../admin/Adddispensermodal'; // Make sure the file name and case match
import Dispenser from '../admin/dispenser';

const DashboardPage = () => {
  return (
    <div className='bg-black container-fluid w-100'style={{height:'74vh'}}>
      
      <DispModal />
      <Dispenser />
    </div>
  );
};

export default DashboardPage;
