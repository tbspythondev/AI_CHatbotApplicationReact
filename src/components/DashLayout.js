import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, NavLink, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashLayout = () => {
  return (
    <>
      <Container fluid className='p-0'>
        <div className='d-flex m-0 '>
          <div className='sidebar-menu-left'>{/* <Sidebar /> */}</div>
          <div className='sidebar-menu-right'>
            <Outlet />
          </div>
        </div>
      </Container>
    </>
  );
};

export default DashLayout;
