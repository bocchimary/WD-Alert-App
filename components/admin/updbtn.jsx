// UpdateButton.js
import React from 'react';
import axios from 'axios';

const reloadPage = () => {
    window.location.reload();
  };

const UpdateButton = () => {

    
  const handleUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:3001/updateRemaining');
      console.log('Update successful:', response.data);
     
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <button onClick={() => { handleUpdate(); reloadPage(); }} className='btn btn-dark'>
  Update Remaining
</button>

  );
};

export default UpdateButton;
