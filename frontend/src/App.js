import React from 'react';
/* import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; */
import { Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import Egitestek from './Egitestek'; // Ezt importálnod kell */
import './App.css';

/* function App() {
  return (
    <div>
      <Auth />
    </div>
  );
} */

function App() {
  return (
    // Nincs <Router> burkoló, csak egyenesen a <Routes>
    <Routes>
      <Route path="/" element={<Auth />} /> {/* Vagy path="/login" */}
      <Route path="/egitestek" element={<Egitestek />} />
    </Routes>
  );
}  

export default App;