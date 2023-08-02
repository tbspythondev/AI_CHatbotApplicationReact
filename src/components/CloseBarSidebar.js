import React from 'react';
import { IoClose } from 'react-icons/io5';

const CloseSidebar = () => {
  const handleOpen = () => {
    const div = document.getElementById('PopUpShowHide');
    div.style.display = 'none';
  };
  return (
    <>
      <div className='close-icon'>
        <IoClose onClick={handleOpen} />
      </div>
    </>
  );
};

export default CloseSidebar;
