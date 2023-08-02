import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { addClassToBody } from '../API/Api';
// import INTELICHAT_LOGO from '../assets/icons/InteliChatLogo.svg';
import INTELICHAT_LOGO from '../assets/images/InteliChatLogo.png';
import Sidebar from '../components/Sidebar';
import CloseBarSidebar from '../components/CloseBarSidebar';

const ComingSoon = () => {
  const location = useLocation();

  const profile = 'Profile';
  const integration = 'Integration';
  const subscription = 'Subscription';
  const billing = 'Billing';
  const security = 'Security';

  useEffect(() => {
    addClassToBody('no-chat');
  }, []);
  return (
    <>
      <div className='chatbot-container'>
        <div className='chatbot-header'>
          <h3 className='opensans-bold mb-0'>
            {location.pathname === '/setting' && `${profile}`}
            {location.pathname === '/setting/integration' && `${integration}`}
            {location.pathname === '/setting/subscription' && `${subscription}`}
            {location.pathname === '/setting/billing' && `${billing}`}
            {location.pathname === '/setting/security' && `${security}`}
          </h3>
        </div>
      </div>
      <h1 className='m-5'>Coming Soon..</h1>
    </>
  );
};

export default ComingSoon;
