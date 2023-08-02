import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { addClassToBody } from '../API/Api';
import '../assets/styles/NotFound.css';

const NotFound = () => {
  const Navigate = useNavigate();

  useEffect(() => {
    addClassToBody('no-chat');
  }, []);

  return (
    <>
      <div className='error'>
        <div className='container-floud'>
          <div className='col-xs-12 ground-color text-center'>
            <div className='container-error-404'>
              <div className='clip'>
                {/* <div className='shadow'> */}
                <div className=''>
                  <span className='digit thirdDigit opensans-bold'>4</span>
                </div>
              </div>
              <div className='clip'>
                <div className='ms-3'>
                  <span className='digit secondDigit opensans-bold'>0</span>
                </div>
              </div>
              <div className='clip'>
                <div className='ms-3'>
                  <span className='digit firstDigit opensans-bold'>4</span>
                </div>
              </div>
            </div>
            <h2 className='h1'>Sorry! Page not found</h2>

            <div className='mt-3'>
              <button className='btn btn-submit-login w-50 text-decoration-underline text-truncate m-auto' onClick={() => Navigate('/')}>
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
