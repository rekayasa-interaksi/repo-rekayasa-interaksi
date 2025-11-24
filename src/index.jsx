import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/authContext';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga4';

const TRACKING_ID_PROD = process.env.REACT_APP_GA_TRACKING_ID_PROD;
const TRACKING_ID_STAGING = process.env.REACT_APP_GA_TRACKING_ID_STAGING;

let currentTrackingId;

if (process.env.NODE_ENV === 'production') {
  currentTrackingId = TRACKING_ID_PROD;
} else {
  currentTrackingId = TRACKING_ID_STAGING;
}

if (currentTrackingId) {
  ReactGA.initialize(currentTrackingId);
  console.log(`Google Analytics initialized with ID: ${currentTrackingId}`);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
} else {
  console.error("Google Analytics Tracking ID is missing!");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
