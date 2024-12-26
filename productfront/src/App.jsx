import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import Home from './components/Home';
import OrderSummary from './components/OrderSummary';
import OrderManagementPage from './components/OrderManagementPage';

const App = () => {
  const clientId = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with your actual client ID

  return (
    <GoogleOAuthProvider clientId={clientId}> {/* Wrap the app with GoogleOAuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/order-management" element={<OrderManagementPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
