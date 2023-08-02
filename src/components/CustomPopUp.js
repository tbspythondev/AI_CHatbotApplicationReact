import React from 'react';

const CustomPopUp = ({ title, onConfirm, onClose, confirmText, closeText, extraButtons, children, variant = 'success', initialWidth, onBlur }) => {
  return (
    <div className='custom-popup' onBlur={onBlur}>
      <div className='popup-content' style={{ width: initialWidth }}>
        <div className={`popup-head ${variant === 'error' ? 'text-danger' : ''}`}>
          <h4 style={{ color: 'black' }}>{title || 'Title'}</h4>
        </div>
        <hr />
        <div className='popup-body'>{children || 'Keep your popup Body here'}</div>
        <hr />
        <div className='popup-footer'>
          <button onClick={onConfirm} className='btn success-btn mx-1 text-capitalize'>
            {confirmText || 'Yes'}
          </button>
          {/* <button onClick={onClose} className='btn btn-danger mx-1 text-capitalize'>
            {closeText || 'No'}
          </button> */}
          {extraButtons && extraButtons}
        </div>
      </div>
    </div>
  );
};

export default CustomPopUp;
