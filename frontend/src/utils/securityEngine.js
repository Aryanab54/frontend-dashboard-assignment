// Comprehensive Security Dashboard Engine

export const generateSecurityInsights = (categories) => {
  const insights = {
    cloudSecurity: analyzeCloudSecurity(categories),
    workloadProtection: analyzeWorkloadProtection(categories),
    containerSecurity: analyzeContainerSecurity(categories),
    incidentManagement: analyzeIncidentManagement(categories)
  };
  
  return {
    ...insights,
    overallRisk: calculateOverallRisk(insights),
    recommendations: generateRecommendations(insights)
  };
};

const analyzeCloudSecurity = (categories) => {
  const cspmCategory = categories.find(cat => cat.id === 'cspm');
  if (!cspmCategory) return { status: 'unknown', score: 0 };
  
  const riskWidget = cspmCategory.widgets.find(w => w.id === 'risk-assessment');
  if (!riskWidget) return { status: 'unknown', score: 0 };
  
  const { failed, warning, passed, total } = riskWidget.data;
  const score = Math.round((passed / total) * 100);
  
  return {
    status: score >= 80 ? 'good' : score >= 60 ? 'warning' : 'critical',
    score,
    issues: failed + warning,
    compliant: passed,
    recommendations: [
      failed > 100 ? 'Address critical security failures immediately' : null,
      warning > 200 ? 'Review and remediate warning items' : null,
      score < 60 ? 'Implement comprehensive security controls' : null
    ].filter(Boolean)
  };
};

const analyzeWorkloadProtection = (categories) => {
  const cwppCategory = categories.find(cat => cat.id === 'cwpp');
  if (!cwppCategory) return { status: 'inactive', alerts: 0 };
  
  const hasActiveMonitoring = cwppCategory.widgets.some(w => w.type !== 'empty');
  
  return {
    status: hasActiveMonitoring ? 'active' : 'inactive',
    alerts: hasActiveMonitoring ? Math.floor(Math.random() * 50) : 0,
    recommendations: [
      !hasActiveMonitoring ? 'Enable workload monitoring and alerting' : null,
      'Configure runtime threat detection',
      'Set up automated response policies'
    ].filter(Boolean)
  };
};

const analyzeContainerSecurity = (categories) => {
  const registryCategory = categories.find(cat => cat.id === 'registry');
  if (!registryCategory) return { status: 'unknown', vulnerabilities: 0 };
  
  const riskWidget = registryCategory.widgets.find(w => w.id === 'image-risk');
  if (!riskWidget) return { status: 'unknown', vulnerabilities: 0 };
  
  const { total, critical, high } = riskWidget.data;
  const riskScore = ((critical * 3 + high * 2) / (total * 3)) * 100;
  
  return {
    status: riskScore < 10 ? 'good' : riskScore < 30 ? 'warning' : 'critical',
    vulnerabilities: critical + high,
    totalImages: total,
    riskScore: Math.round(riskScore),
    recommendations: [
      critical > 0 ? `Fix ${critical} critical vulnerabilities immediately` : null,
      high > 10 ? `Address ${high} high-priority vulnerabilities` : null,
      'Implement automated vulnerability scanning in CI/CD'
    ].filter(Boolean)
  };
};

const analyzeIncidentManagement = (categories) => {
  const ticketCategory = categories.find(cat => cat.id === 'ticket');
  if (!ticketCategory) return { status: 'inactive', openTickets: 0 };
  
  const ticketWidget = ticketCategory.widgets.find(w => w.id === 'open-tickets');
  if (!ticketWidget) return { status: 'inactive', openTickets: 0 };
  
  const { total, critical, high } = ticketWidget.data;
  const urgentTickets = critical + high;
  
  return {
    status: urgentTickets > 20 ? 'overloaded' : urgentTickets > 10 ? 'busy' : 'manageable',
    openTickets: total,
    urgentTickets,
    recommendations: [
      critical > 5 ? `${critical} critical tickets need immediate attention` : null,
      urgentTickets > 15 ? 'Consider increasing security team capacity' : null,
      'Implement automated ticket triage and routing'
    ].filter(Boolean)
  };
};

const calculateOverallRisk = (insights) => {
  const scores = [
    insights.cloudSecurity.score || 0,
    insights.workloadProtection.status === 'active' ? 80 : 20,
    100 - (insights.containerSecurity.riskScore || 50),
    insights.incidentManagement.status === 'manageable' ? 90 : 
    insights.incidentManagement.status === 'busy' ? 70 : 40
  ];
  
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  return {
    score: Math.round(avgScore),
    level: avgScore >= 80 ? 'LOW' : avgScore >= 60 ? 'MEDIUM' : 'HIGH',
    color: avgScore >= 80 ? '#28a745' : avgScore >= 60 ? '#ffc107' : '#dc3545'
  };
};

const generateRecommendations = (insights) => {
  const allRecommendations = [
    ...insights.cloudSecurity.recommendations || [],
    ...insights.workloadProtection.recommendations || [],
    ...insights.containerSecurity.recommendations || [],
    ...insights.incidentManagement.recommendations || []
  ];
  
  return allRecommendations.slice(0, 5); // Top 5 recommendations
};

export const generateRealTimeAlerts = () => {
  const alertTypes = [
    { type: 'critical', message: 'Suspicious login detected from unusual location', category: 'Cloud Security' },
    { type: 'warning', message: 'High CPU usage detected on production workload', category: 'Workload Protection' },
    { type: 'info', message: 'New container image scanned - 3 vulnerabilities found', category: 'Container Security' },
    { type: 'critical', message: 'Critical security ticket SLA breach imminent', category: 'Incident Management' }
  ];
  
  return alertTypes[Math.floor(Math.random() * alertTypes.length)];
};

export const getSecurityMetrics = (timeRange = '24h') => {
  const multiplier = timeRange === '1h' ? 0.1 : timeRange === '7d' ? 7 : 1;
  
  return {
    threatsBlocked: Math.floor(1247 * multiplier),
    vulnerabilitiesFixed: Math.floor(89 * multiplier),
    complianceScore: Math.floor(85 + Math.random() * 10),
    incidentsResolved: Math.floor(23 * multiplier),
    meanTimeToResolve: `${Math.floor(4 + Math.random() * 8)}h ${Math.floor(Math.random() * 60)}m`
  };
};