import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { getUserId } from '../services/utils';
import { LoadingSpinner, ErrorMessage } from './UI';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎓 AI-Powered FYP Evaluator
          </h1>
          <p className="text-xl text-gray-600">
            Get intelligent insights on your Final Year Project ideas
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Describe Your FYP Idea
              </label>
              <textarea
                value={idea}
                onChange={handleIdeaChange}
                placeholder="Describe your final year project idea in detail. What problem does it solve? What technologies will you use? Minimum 50 characters required..."
                className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${charCount < 50 ? 'text-red-500' : 'text-green-500'} font-semibold`}>
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
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
              >
                {loading ? 'Checking...' : '🔍 Check Similar Ideas'}
              </button>
              <button
                type="submit"
                disabled={charCount < 50 || loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {loading ? 'Evaluating...' : '⚡ Evaluate My Idea'}
              </button>
            </div>
          </form>

          {/* Similar Ideas Alert */}
          {similarIdeas.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Similar Ideas Found ({similarIdeas.length})
              </h3>
              <div className="max-h-48 overflow-y-auto">
                {similarIdeas.map((similarIdea) => (
                  <div key={similarIdea.idea_id} className="mb-2 p-2 bg-white rounded border border-yellow-100">
                    <p className="text-sm text-gray-700 truncate">{similarIdea.idea_text}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{similarIdea.domain}</span>
                      <span className="text-sm font-semibold text-yellow-700">Score: {similarIdea.overall_score.toFixed(1)}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default HomePage;
