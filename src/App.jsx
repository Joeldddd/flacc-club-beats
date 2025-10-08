import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authenticateUser } from './api/firebase';
import HomePage from './pages/HomePage';
import BeatsPage from './pages/BeatsPage';
import DetalleBeats from './pages/DetalleBeats';
import ComprarBeats from './pages/ComprarBeats';


import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css'; 

/* global __app_id, __firebase_config, __initial_auth_token */

function App() {
  const [isReady, setIsReady] = useState(false); 


  useEffect(() => {
  
    authenticateUser().then(success => {
      if (success) {
        console.log("DEBUG APP: Firebase y autenticación listos.");
        setIsReady(true);
      } else {
        console.error("DEBUG APP: Falló la autenticación inicial de Firebase.");
      }
    });

  }, []);


  return (
    <BrowserRouter>
      <Navbar /> 
      
      <div style={{ flexGrow: 1 }}> 
        
        {/* Muestra la alerta mientras no esté listo (isReady === false) */}
        {!isReady && 
          <div className="text-center my-5">
            <p style={{ color: '#ff6961' }}>🔴 Alerta: La conexión a Firebase podría estar fallando. Revisa la consola.</p>
          </div>
        }

        
        {isReady && (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/beats" element={<BeatsPage />} />
            <Route path="/beats/:id" element={<DetalleBeats />} />
            <Route path="/comprar" element={<ComprarBeats />} />
          </Routes>
        )}

      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;


     
