import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import HistoryPage from './components/HistoryPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700">
              🎓 FYP Evaluator
            </Link>
            <div className="flex gap-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Home
              </Link>
              <Link
                to="/history"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                History
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
