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
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-dark-bg to-accent-cyan/5" 
           style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 6s ease infinite' }}>
      </div>

      {/* Floating accent orbs */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 py-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">✨ Your Evaluation Results</h1>
          <p className="text-gray-400">Here's what the AI found about your project idea</p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
          {/* Overall Score */}
          <div className="text-center mb-8 pb-8 border-b border-dark-border">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Overall Assessment</h2>
            <div className={`text-6xl font-bold mb-2 transition-all ${
              results.overall_score >= 8 ? 'text-green-400' :
              results.overall_score >= 6 ? 'text-blue-400' :
              results.overall_score >= 4 ? 'text-yellow-400' :
              'text-red-400'
            } animate-fade-in`}>
              {results.overall_score.toFixed(1)}/10
            </div>
            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              <Badge label={`Domain: ${results.scores.domain}`} variant="primary" />
              <Badge label={`Complexity: ${results.scores.complexity}`} variant={getComplexityColor(results.scores.complexity)} />
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-300 mb-6">Detailed Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScoreCard label="Uniqueness" score={results.scores.uniqueness} />
              <ScoreCard label="Technical Feasibility" score={results.scores.feasibility} />
              <ScoreCard label="Problem-Solving Value" score={results.scores.problem_solving_value} />
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-8 p-6 bg-green-900/20 rounded-lg border border-green-700 animate-fade-in">
            <h3 className="text-xl font-semibold text-green-400 mb-4">💪 Strengths</h3>
            <ul className="space-y-2">
              {results.strengths.map((strength, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-green-400 font-bold mr-3">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="mb-8 p-6 bg-red-900/20 rounded-lg border border-red-700 animate-fade-in">
            <h3 className="text-xl font-semibold text-red-400 mb-4">⚠️ Weaknesses</h3>
            <ul className="space-y-2">
              {results.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-red-400 font-bold mr-3">✗</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvement Suggestions */}
          <div className="mb-8 p-6 bg-blue-900/20 rounded-lg border border-blue-700 animate-fade-in">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">🚀 Improvement Suggestions</h3>
            <ol className="space-y-3">
              {results.improvement_suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-400 font-bold mr-3 text-lg">{index + 1}.</span>
                  <span className="text-gray-300">{suggestion}</span>
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
              className="flex-1 px-6 py-3 bg-dark-border text-gray-300 rounded-lg font-semibold hover:bg-dark-border/80 transition-all border border-dark-border hover:border-accent-purple"
            >
              ← Evaluate Another Idea
            </button>
            <button
              onClick={() => window.location.href = '/history'}
              className="flex-1 px-6 py-3 bg-gradient-hero text-white rounded-lg font-semibold hover:shadow-glow transition-all"
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
