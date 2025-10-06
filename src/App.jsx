import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import BeatsPage from './pages/BeatsPage.jsx';
import DetalleBeats from './pages/DetalleBeats.jsx';
import ComprarBeats from './pages/ComprarBeats.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/beats" element={<BeatsPage />} />
        <Route path="/comprar" element={<ComprarBeats />} /> 
        <Route path="/beats/:id" element={<DetalleBeats />} />
        <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
     
