// src/App.jsx
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ArcGISMap from './ArcGISMap';
import './App.css';

function App() {
  const [showMap, setShowMap] = useState(false);

  const handleGetStarted = () => {
    setShowMap(true);
  };

  return (
    <div className="app-container">
      {!showMap ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <div className="map-container">
          <ArcGISMap />
        </div>
      )}
    </div>
  );
}

export default App;
