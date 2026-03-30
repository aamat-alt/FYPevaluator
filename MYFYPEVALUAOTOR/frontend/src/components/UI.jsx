import React from 'react';

export const ProgressBar = ({ percentage, label }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <span className="text-sm font-medium text-accent-cyan">{percentage}%</span>
      </div>
      <div className="w-full bg-dark-border rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export const ScoreCard = ({ label, score, max = 10 }) => {
  const percentage = (score / max) * 100;
  let bgColor, glowColor, textColor;
  
  if (percentage >= 80) {
    bgColor = 'bg-green-900/20';
    glowColor = 'shadow-glow';
    textColor = 'text-green-400';
  } else if (percentage >= 60) {
    bgColor = 'bg-blue-900/20';
    glowColor = 'shadow-glow-cyan';
    textColor = 'text-blue-400';
  } else if (percentage >= 40) {
    bgColor = 'bg-yellow-900/20';
    glowColor = 'hover:shadow-glow';
    textColor = 'text-yellow-400';
  } else {
    bgColor = 'bg-red-900/20';
    glowColor = 'hover:shadow-glow';
    textColor = 'text-red-400';
  }

  return (
    <div className={`p-4 rounded-lg border border-dark-border ${bgColor} transition-all duration-300 hover:${glowColor} hover:scale-105`}>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">{label}</h3>
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
    default: 'bg-dark-border text-gray-300',
    primary: 'bg-accent-purple/20 text-accent-purple',
    success: 'bg-green-900/20 text-green-400',
    warning: 'bg-yellow-900/20 text-yellow-400',
    danger: 'bg-red-900/20 text-red-400',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border border-dark-border ${variantClasses[variant]}`}>
      {label}
    </span>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full animate-spin opacity-75"></div>
        <div className="absolute inset-2 bg-dark-card rounded-full"></div>
      </div>
    </div>
  );
};

export const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg animate-fade-in" role="alert">
      <strong className="font-bold">⚠️ Error!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export const SuccessMessage = ({ message }) => {
  return (
    <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-lg animate-fade-in" role="alert">
      <strong className="font-bold">✓ Success!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export const AnimatedGradientBg = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-dark-bg to-accent-cyan/10 animate-gradient-shift" 
         style={{ backgroundSize: '200% 200%' }}>
    </div>
  );
};
