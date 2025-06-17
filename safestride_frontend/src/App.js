import React from 'react';
import './App.css';
import SafeStrideContainer from './SafeStrideContainer';

// PUBLIC_INTERFACE
function App() {
  // This is the new main app entry: render SafeStride container
  return (
    <div className="app" style={{background: "inherit", minHeight: "100vh"}}>
      <SafeStrideContainer />
    </div>
  );
}

export default App;