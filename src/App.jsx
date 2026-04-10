import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' ? (
        <LandingPage onStart={() => setCurrentPage('dashboard')} />
      ) : (
        <Dashboard onNav={(page) => setCurrentPage(page)} />
      )}
    </div>
  );
}

export default App;
