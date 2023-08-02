import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import initFacebookSDK from './initFacebookSDK';
import reportWebVitals from './reportWebVitals';
// import { NameProvider } from './components/Contexts/NameContexts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <NameProvider> */}
    <App />
    {/* </NameProvider> */}
  </React.StrictMode>
);

initFacebookSDK().then(() => {
  root.render(
    <React.StrictMode>
      {/* <NameProvider> */}
      <App />
      {/* </NameProvider> */}
    </React.StrictMode>
  );
});

reportWebVitals();
