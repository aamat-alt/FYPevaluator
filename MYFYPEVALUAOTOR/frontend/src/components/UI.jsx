import React from 'react';

export const ProgressBar = ({ percentage, label }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export const ScoreCard = ({ label, score, max = 10 }) => {
  const percentage = (score / max) * 100;
  const color = percentage >= 80 ? 'bg-green-100 border-green-300' :
                percentage >= 60 ? 'bg-blue-100 border-blue-300' :
                percentage >= 40 ? 'bg-yellow-100 border-yellow-300' :
                'bg-red-100 border-red-300';

  const textColor = percentage >= 80 ? 'text-green-700' :
                    percentage >= 60 ? 'text-blue-700' :
                    percentage >= 40 ? 'text-yellow-700' :
                    'text-red-700';

  return (
    <div className={`p-4 rounded-lg border ${color} transition-all`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{label}</h3>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <ProgressBar percentage={percentage} label="" />
        </div>
        <div className={`ml-4 text-2xl font-bold ${textColor}`}>
          {score}/{max}
        </div>
      </div>
    </div>
  );
};

export const Badge = ({ label, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-200 text-blue-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    danger: 'bg-red-200 text-red-800',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variantClasses[variant]}`}>
      {label}
    </span>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export const SuccessMessage = ({ message }) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Success!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};
