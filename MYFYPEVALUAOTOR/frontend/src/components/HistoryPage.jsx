import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { getUserId, formatDate } from '../services/utils';
import { LoadingSpinner, ErrorMessage } from './UI';

export const HistoryPage = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = getUserId();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await apiService.getHistory(userId);
      setEvaluations(data.evaluations || []);
    } catch (err) {
      setError('Failed to load evaluation history');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getComplexityColor = (complexity) => {
    const colors = {
      Low: 'bg-green-900/20 text-green-400 border-green-700',
      Medium: 'bg-yellow-900/20 text-yellow-400 border-yellow-700',
      High: 'bg-red-900/20 text-red-400 border-red-700',
    };
    return colors[complexity] || colors.Medium;
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden py-12">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-dark-bg to-accent-cyan/5" 
           style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 6s ease infinite' }}>
      </div>

      {/* Floating accent orbs */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-accent-purple/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-gray-100 mb-8 animate-slide-up">📚 My Evaluation History</h1>

        {evaluations.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-400 text-lg">No evaluations yet. Submit your first idea to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {evaluations.map((evaluation) => (
              <div
                key={evaluation.idea_id}
                onClick={() => setSelectedEvaluation(evaluation)}
                className="bg-dark-card border border-dark-border rounded-xl shadow-lg hover:shadow-2xl hover:border-accent-purple cursor-pointer transition-all p-6 hover:scale-102 animate-fade-in"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-200 flex-1 line-clamp-2">
                    {evaluation.idea_text}
                  </h3>
                  <div className="text-right ml-4">
                    <div className={`text-2xl font-bold ${evaluation.overall_score >= 7 ? 'text-green-400' : 'text-blue-400'}`}>
                      {evaluation.overall_score.toFixed(1)}/10
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getComplexityColor(evaluation.scores.complexity)}`}>
                    {evaluation.scores.complexity}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent-purple/20 text-accent-purple border border-accent-purple/50">
                    {evaluation.scores.domain}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{formatDate(evaluation.created_at)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedEvaluation && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-dark-card border border-dark-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-hero text-white p-6 flex justify-between items-start">
                <h2 className="text-2xl font-bold">Evaluation Details</h2>
                <button
                  onClick={() => setSelectedEvaluation(null)}
                  className="text-2xl font-bold hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                {/* Idea */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Idea</h3>
                  <p className="text-gray-300 bg-dark-bg p-4 rounded-lg">{selectedEvaluation.idea_text}</p>
                </div>

                {/* Scores Grid */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Scores</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Uniqueness</p>
                      <p className="text-2xl font-bold text-blue-400">{selectedEvaluation.scores.uniqueness}/10</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Feasibility</p>
                      <p className="text-2xl font-bold text-green-400">{selectedEvaluation.scores.feasibility}/10</p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Problem-Solving Value</p>
                      <p className="text-2xl font-bold text-yellow-400">{selectedEvaluation.scores.problem_solving_value}/10</p>
                    </div>
                    <div className="bg-purple-900/20 border border-purple-700 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Overall Score</p>
                      <p className="text-2xl font-bold text-purple-400">{selectedEvaluation.overall_score.toFixed(1)}/10</p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Complexity</p>
                    <p className={`px-3 py-1 rounded inline-block text-sm font-semibold border ${getComplexityColor(selectedEvaluation.scores.complexity)}`}>
                      {selectedEvaluation.scores.complexity}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Domain</p>
                    <p className="text-lg font-semibold text-accent-cyan">{selectedEvaluation.scores.domain}</p>
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">💪 Strengths</h3>
                  <ul className="space-y-2">
                    {selectedEvaluation.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 font-bold mr-3">✓</span>
                        <span className="text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-3">⚠️ Weaknesses</h3>
                  <ul className="space-y-2">
                    {selectedEvaluation.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-400 font-bold mr-3">✗</span>
                        <span className="text-gray-300">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Suggestions */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">🚀 Improvement Suggestions</h3>
                  <ol className="space-y-2">
                    {selectedEvaluation.improvement_suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 font-bold mr-3">{index + 1}.</span>
                        <span className="text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Date */}
                <p className="text-sm text-gray-500">
                  Evaluated on {formatDate(selectedEvaluation.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
