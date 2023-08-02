import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getLocalStorage, removeClassToBody } from '../../API/Api';

const AuthGaurd = () => {
  removeClassToBody('auth-page');
  let token = getLocalStorage('apiToken');
  return <>{token ? <Outlet /> : <Navigate replace to='/' />}</>;
};

export default AuthGaurd;
