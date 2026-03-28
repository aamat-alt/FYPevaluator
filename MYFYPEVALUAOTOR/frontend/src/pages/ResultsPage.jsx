import React from 'react';
import { ScoreCard, Badge } from '../components/UI';
import { formatDate } from '../services/utils';

export const ResultsPage = ({ results, onBack }) => {
  const getComplexityColor = (complexity) => {
    const colors = {
      Low: 'success',
      Medium: 'warning',
      High: 'danger',
    };
    return colors[complexity] || 'default';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ Your Evaluation Results</h1>
          <p className="text-gray-600">Here's what the AI found about your project idea</p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8 mb-8">
          {/* Overall Score */}
          <div className="text-center mb-8 pb-8 border-b-2 border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overall Assessment</h2>
            <div className={`text-6xl font-bold mb-2 ${
              results.overall_score >= 8 ? 'text-green-600' :
              results.overall_score >= 6 ? 'text-blue-600' :
              results.overall_score >= 4 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {results.overall_score.toFixed(1)}/10
            </div>
            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              <Badge label={`Domain: ${results.scores.domain}`} variant="primary" />
              <Badge label={`Complexity: ${results.scores.complexity}`} variant={getComplexityColor(results.scores.complexity)} />
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Detailed Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScoreCard label="Uniqueness" score={results.scores.uniqueness} />
              <ScoreCard label="Technical Feasibility" score={results.scores.feasibility} />
              <ScoreCard label="Problem-Solving Value" score={results.scores.problem_solving_value} />
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
            <h3 className="text-xl font-semibold text-green-800 mb-4">💪 Strengths</h3>
            <ul className="space-y-2">
              {results.strengths.map((strength, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="mb-8 p-6 bg-red-50 rounded-lg border-l-4 border-red-600">
            <h3 className="text-xl font-semibold text-red-800 mb-4">⚠️ Weaknesses</h3>
            <ul className="space-y-2">
              {results.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvement Suggestions */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">🚀 Improvement Suggestions</h3>
            <ol className="space-y-3">
              {results.improvement_suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3 text-lg">{index + 1}.</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Submission Date */}
          <p className="text-center text-sm text-gray-500 mb-8">
            Submitted on {formatDate(results.created_at)}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              ← Evaluate Another Idea
            </button>
            <button
              onClick={() => window.location.href = '/history'}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              📚 View My History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
