import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import HistoryPage from './components/HistoryPage';
import './App.css';

function App() {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-gray-100">
        {/* Navigation */}
        <nav className="bg-dark-card border-b border-dark-border backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              🎓 FYP Evaluator
            </Link>
            <div className="flex gap-6">
              <Link
                to="/"
                className="text-gray-400 hover:text-accent-cyan font-semibold transition-colors"
              >
                Home
              </Link>
              <Link
                to="/history"
                className="text-gray-400 hover:text-accent-cyan font-semibold transition-colors"
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
