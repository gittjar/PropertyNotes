import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PropertyDetails from './PropertyDetails';
import Contact from './ContactForm'; 

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/contact" element={<Contact />} /> 
      </Routes>
    </Router>
  );
}

export default Main;