import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { getUserId } from '../services/utils';
import { LoadingSpinner, ErrorMessage, AnimatedGradientBg } from './UI';
import ResultsPage from '../pages/ResultsPage';

export const HomePage = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [similarIdeas, setSimilarIdeas] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const userId = getUserId();

  const handleIdeaChange = (e) => {
    const text = e.target.value;
    setIdea(text);
    setCharCount(text.length);
  };

  const handleCheckSimilar = async () => {
    if (idea.length < 50) {
      setError('Idea must be at least 50 characters');
      return;
    }

    try {
      setLoading(true);
      const data = await apiService.findSimilarIdeas(idea);
      setSimilarIdeas(data.similar_ideas || []);
    } catch (err) {
      console.error('Error finding similar ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (idea.length < 50) {
      setError('Idea must be at least 50 characters');
      return;
    }

    try {
      setLoading(true);
      const evaluation = await apiService.evaluateIdea(idea, userId);
      setResults(evaluation);
      setIdea('');
      setCharCount(0);
      setSimilarIdeas([]);
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : err.detail || 'Failed to evaluate idea';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return <ResultsPage results={results} onBack={() => setResults(null)} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-dark-bg to-accent-cyan/5" 
           style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 6s ease infinite' }}>
      </div>

      {/* Floating accent orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              AI-Powered FYP Evaluator
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Get intelligent insights on your Final Year Project ideas with GitHub research
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-3xl mx-auto bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-8 mb-8 backdrop-blur animate-fade-in">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-200 mb-2">
                Describe Your FYP Idea
              </label>
              <textarea
                value={idea}
                onChange={handleIdeaChange}
                placeholder="Describe your final year project idea in detail. What problem does it solve? What technologies will you use? Minimum 50 characters required..."
                className="w-full h-48 px-4 py-3 bg-dark-bg border-2 border-dark-border text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 resize-none transition-all"
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm font-semibold transition-colors ${charCount < 50 ? 'text-red-400' : 'text-green-400'}`}>
                  {charCount}/50 characters minimum
                </span>
              </div>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={handleCheckSimilar}
                disabled={charCount < 50 || loading}
                className="flex-1 px-6 py-3 bg-dark-border text-gray-200 rounded-lg font-semibold hover:bg-dark-border/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-dark-border hover:border-accent-cyan"
              >
                {loading ? 'Checking...' : '🔍 Check Similar Ideas'}
              </button>
              <button
                type="submit"
                disabled={charCount < 50 || loading}
                className="flex-1 px-6 py-3 bg-gradient-hero text-white rounded-lg font-semibold hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all animate-pulse-glow hover:animate-none disabled:animate-none"
              >
                {loading ? 'Evaluating...' : '⚡ Evaluate My Idea'}
              </button>
            </div>
          </form>

          {/* Similar Ideas Alert */}
          {similarIdeas.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-900/20 border-2 border-yellow-700 rounded-lg animate-fade-in">
              <h3 className="font-semibold text-yellow-300 mb-2">
                ⚠️ Similar Ideas Found ({similarIdeas.length})
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {similarIdeas.map((similarIdea) => (
                  <div key={similarIdea.idea_id} className="p-2 bg-dark-bg rounded border border-yellow-700/50 hover:border-yellow-500 transition-colors">
                    <p className="text-sm text-gray-300 truncate">{similarIdea.idea_text}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{similarIdea.domain}</span>
                      <span className="text-sm font-semibold text-yellow-400">Score: {similarIdea.overall_score.toFixed(1)}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
