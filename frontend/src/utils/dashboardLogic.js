// Real dashboard logic and calculations
export const calculateSecurityScore = (data) => {
  const total = data.failed + data.warning + data.passed + data.notAvailable;
  const score = Math.round((data.passed / total) * 100);
  return {
    score,
    status: score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Poor',
    color: score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545'
  };
};

export const generateAlerts = () => {
  const alerts = [
    { type: 'critical', message: 'Unauthorized access detected in production', time: '2 min ago' },
    { type: 'warning', message: 'High CPU usage on server cluster-01', time: '5 min ago' },
    { type: 'info', message: 'Backup completed successfully', time: '10 min ago' },
    { type: 'critical', message: 'SSL certificate expires in 7 days', time: '15 min ago' }
  ];
  return alerts.slice(0, Math.floor(Math.random() * 4) + 1);
};

export const calculateTrends = (current, previous) => {
  const change = ((current - previous) / previous) * 100;
  return {
    percentage: Math.abs(change).toFixed(1),
    direction: change >= 0 ? 'up' : 'down',
    isGood: change <= 0 // For security metrics, decrease is good
  };
};

export const getRecommendations = (data) => {
  const recommendations = [];
  
  if (data.failed > 100) {
    recommendations.push('🔴 Critical: Address failed security checks immediately');
  }
  if (data.warning > 200) {
    recommendations.push('🟡 Warning: Review and fix warning items');
  }
  if (data.notAvailable > 50) {
    recommendations.push('🔵 Info: Enable monitoring for unavailable resources');
  }
  
  return recommendations;
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const getTimeRangeData = (range) => {
  const multipliers = {
    '1 hour': 0.1,
    '24 hours': 1,
    '7 days': 7,
    '30 days': 30
  };
  
  const base = {
    failed: 1689,
    warning: 681,
    passed: 7253,
    notAvailable: 36
  };
  
  const multiplier = multipliers[range] || 1;
  return Object.keys(base).reduce((acc, key) => {
    acc[key] = Math.floor(base[key] * multiplier * (0.8 + Math.random() * 0.4));
    return acc;
  }, {});
};