export const widgetTemplates = {
  cspm: [
    {
      name: 'Security Compliance',
      type: 'donut',
      data: { total: 850, connected: 680, notConnected: 170 }
    },
    {
      name: 'Policy Violations', 
      type: 'donut',
      data: { total: 2340, failed: 234, warning: 456, notAvailable: 50, passed: 1600 }
    },
    {
      name: 'Resource Monitoring',
      type: 'bar',
      data: { total: 1250, critical: 15, high: 89 }
    }
  ],
  cwpp: [
    {
      name: 'Container Security',
      type: 'donut', 
      data: { total: 456, connected: 320, notConnected: 136 }
    },
    {
      name: 'Runtime Threats',
      type: 'bar',
      data: { total: 89, critical: 5, high: 23 }
    },
    {
      name: 'Kubernetes Alerts',
      type: 'empty',
      text: 'No active threats detected!'
    }
  ],
  registry: [
    {
      name: 'Vulnerability Scan',
      type: 'bar',
      data: { total: 2890, critical: 45, high: 234 }
    },
    {
      name: 'License Compliance',
      type: 'donut',
      data: { total: 567, failed: 67, warning: 123, notAvailable: 12, passed: 365 }
    },
    {
      name: 'Image Quality Score', 
      type: 'bar',
      data: { total: 95, critical: 2, high: 8 }
    }
  ]
};

const categoryMapping = {
  'cspm': 'cspm',
  'cwpp': 'cwpp', 
  'registry': 'registry'
};

export const getRandomWidget = (categoryId) => {
  const mappedCategory = categoryMapping[categoryId] || 'cspm';
  const templates = widgetTemplates[mappedCategory];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    ...randomTemplate,
    id: Date.now().toString(),
    name: randomTemplate.name + ` (${Math.floor(Math.random() * 100)})`
  };
};