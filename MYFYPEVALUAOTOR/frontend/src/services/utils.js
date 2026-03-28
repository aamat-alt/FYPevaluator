// Utility function to get or generate user ID
export const getUserId = () => {
  let userId = localStorage.getItem('fyp_evaluator_user_id');
  
  if (!userId) {
    // Generate a random UUID-like string
    userId = 'user_' + Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    localStorage.setItem('fyp_evaluator_user_id', userId);
  }
  
  return userId;
};

// Format date to readable format
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get color based on score
export const getScoreColor = (score) => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-blue-600';
  if (score >= 4) return 'text-yellow-600';
  return 'text-red-600';
};

// Get background color based on score
export const getScoreBgColor = (score) => {
  if (score >= 8) return 'bg-green-100';
  if (score >= 6) return 'bg-blue-100';
  if (score >= 4) return 'bg-yellow-100';
  return 'bg-red-100';
};
