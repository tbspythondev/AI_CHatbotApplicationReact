import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getLocalStorage } from '../../API/Api';

const UnAuthGaurd = () => {
  let token = getLocalStorage('apiToken');
  return <>{!token ? <Outlet /> : <Navigate replace to='/' />}</>;
};

export default UnAuthGaurd;
