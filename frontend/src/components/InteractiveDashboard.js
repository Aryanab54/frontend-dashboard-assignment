import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTimeRange } from '../store/dashboardSlice';
import { getTimeRangeData } from '../utils/dashboardLogic';

const InteractiveDashboard = ({ children }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.dashboard);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        // Simulate real-time data updates
        const newData = getTimeRangeData('24 hours');
        dispatch(updateTimeRange({ range: 'auto-refresh', data: newData }));
      }, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, dispatch]);

  const exportDashboard = () => {
    const dashboardData = {
      categories,
      exportedAt: new Date().toISOString(),
      totalWidgets: categories.reduce((sum, cat) => sum + cat.widgets.length, 0)
    };
    
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetDashboard = () => {
    if (window.confirm('Reset dashboard to default state? This will remove all custom widgets.')) {
      localStorage.removeItem('dashboardState');
      window.location.reload();
    }
  };

  return (
    <div className="interactive-dashboard">
      <div className="dashboard-controls">
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto Refresh
          </label>
          {autoRefresh && (
            <select 
              value={refreshInterval} 
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            >
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
              <option value={300000}>5m</option>
            </select>
          )}
        </div>
        
        <div className="control-group">
          <button onClick={exportDashboard} className="control-btn">
            📥 Export
          </button>
          <button onClick={resetDashboard} className="control-btn">
            🔄 Reset
          </button>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default InteractiveDashboard;