import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BeatsPage from './pages/BeatsPage';
import DetalleBeats from './pages/DetalleBeats';
import ComprarBeats from './pages/ComprarBeats';
import './App.css'; 

/* global __app_id, __firebase_config, __initial_auth_token */

function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);


  useEffect(() => {
    const injectedConfig = typeof __firebase_config !== 'undefined' ? __firebase_config : null;
    
    if (!injectedConfig || injectedConfig.trim() === '' || injectedConfig.trim() === '{}') {
        console.error("DEBUG APP: Configuración de Firebase INEXISTENTE o vacía.");
        return;
    }
    
    try {
        const firebaseConfig = JSON.parse(injectedConfig);
        initializeApp(firebaseConfig);
        console.log("DEBUG APP: Firebase inicializado con éxito en App.jsx.");
        setIsFirebaseInitialized(true);
    } catch (e) {
        console.error("DEBUG APP: Falló el parseo o la inicialización:", e.message);
    }
  }, []);


  return (
    <BrowserRouter>
 
      <Navbar /> 
      
     
      <div style={{ flexGrow: 1 }}> 
       
        {!isFirebaseInitialized && 
          <div className="text-center my-5">
            <p style={{ color: '#ff6961' }}>🔴 Alerta: La conexión a Firebase podría estar fallando. Revisa la consola.</p>
          </div>
        }
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/beats" element={<BeatsPage />} />
          <Route path="/beats/:id" element={<DetalleBeats />} />
          <Route path="/comprar" element={<ComprarBeats />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;



     
