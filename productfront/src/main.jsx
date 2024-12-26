import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

// Optional: Import Bootstrap JS and Popper.js for Bootstrap components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
