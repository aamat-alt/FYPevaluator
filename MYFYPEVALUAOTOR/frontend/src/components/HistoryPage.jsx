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
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800',
    };
    return colors[complexity] || colors.Medium;
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📚 My Evaluation History</h1>

        {evaluations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No evaluations yet. Submit your first idea to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {evaluations.map((evaluation) => (
              <div
                key={evaluation.idea_id}
                onClick={() => setSelectedEvaluation(evaluation)}
                className="bg-white rounded-lg shadow hover:shadow-xl cursor-pointer transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1 line-clamp-2">
                    {evaluation.idea_text}
                  </h3>
                  <div className="text-right ml-4">
                    <div className={`text-2xl font-bold ${evaluation.overall_score >= 7 ? 'text-green-600' : 'text-blue-600'}`}>
                      {evaluation.overall_score.toFixed(1)}/10
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getComplexityColor(evaluation.scores.complexity)}`}>
                    {evaluation.scores.complexity}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-start">
                <h2 className="text-2xl font-bold">Evaluation Details</h2>
                <button
                  onClick={() => setSelectedEvaluation(null)}
                  className="text-2xl font-bold hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                {/* Idea */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Idea</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedEvaluation.idea_text}</p>
                </div>

                {/* Scores Grid */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Scores</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Uniqueness</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedEvaluation.scores.uniqueness}/10</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Feasibility</p>
                      <p className="text-2xl font-bold text-green-600">{selectedEvaluation.scores.feasibility}/10</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Problem-Solving Value</p>
                      <p className="text-2xl font-bold text-yellow-600">{selectedEvaluation.scores.problem_solving_value}/10</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Overall Score</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedEvaluation.overall_score.toFixed(1)}/10</p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Complexity</p>
                    <p className={`text-lg font-semibold px-3 py-1 rounded inline-block ${getComplexityColor(selectedEvaluation.scores.complexity)}`}>
                      {selectedEvaluation.scores.complexity}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Domain</p>
                    <p className="text-lg font-semibold text-blue-600">{selectedEvaluation.scores.domain}</p>
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-3">💪 Strengths</h3>
                  <ul className="space-y-2">
                    {selectedEvaluation.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 font-bold mr-3">✓</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-red-700 mb-3">⚠️ Weaknesses</h3>
                  <ul className="space-y-2">
                    {selectedEvaluation.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 font-bold mr-3">✗</span>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Suggestions */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3">🚀 Improvement Suggestions</h3>
                  <ol className="space-y-2">
                    {selectedEvaluation.improvement_suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 font-bold mr-3">{index + 1}.</span>
                        <span className="text-gray-700">{suggestion}</span>
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
