import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowAddWidget, setSelectedCategory, addCategory, addDefaultWidget } from '../store/dashboardSlice';
import { getRandomWidget } from '../utils/widgetTemplates';
import { generateSecurityInsights, generateRealTimeAlerts, getSecurityMetrics } from '../utils/securityEngine';
import Category from './Category';
import AddWidgetModal from './AddWidgetModal';
import SearchBar from './SearchBar';
import TimeRangeSelector from './TimeRangeSelector';
import InteractiveDashboard from './InteractiveDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const { categories, showAddWidget, searchTerm } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const [securityInsights, setSecurityInsights] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [securityMetrics, setSecurityMetrics] = useState(null);
  
  useEffect(() => {
    // Generate comprehensive security insights
    const insights = generateSecurityInsights(categories);
    setSecurityInsights(insights);
    
    // Get security metrics
    const metrics = getSecurityMetrics();
    setSecurityMetrics(metrics);
    
    // Real-time alert simulation
    const alertInterval = setInterval(() => {
      const alert = generateRealTimeAlerts();
      setCurrentAlert(alert);
      setTimeout(() => setCurrentAlert(null), 5000);
    }, 15000);
    
    return () => clearInterval(alertInterval);
  }, [categories]);

  const filteredCategories = categories.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget => 
      widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.widgets.length > 0 || searchTerm === '');

  const handleAddWidget = (categoryId) => {
    dispatch(setSelectedCategory(categoryId));
    dispatch(setShowAddWidget(true));
  };

  const handleAddDefaultWidget = (categoryId) => {
    const widget = getRandomWidget(categoryId);
    dispatch(addDefaultWidget({ categoryId, widget }));
  };





  const handleMenu = () => {
    alert('Menu options: Export Dashboard, Settings, Help');
  };

  return (
    <InteractiveDashboard>
      <div className="dashboard">
      <div className="breadcrumb">
        <span className="breadcrumb-item">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item active">Dashboard V2</span>
      </div>
      
      <div className="dashboard-header">
        <div className="header-left">
          <h1>CNAPP Dashboard</h1>
          {securityInsights && (
            <div className="security-status">
              <span className="status-label">Risk Level:</span>
              <span 
                className={`risk-badge ${securityInsights.overallRisk.level.toLowerCase()}`}
                style={{ backgroundColor: securityInsights.overallRisk.color }}
              >
                {securityInsights.overallRisk.level}
              </span>
            </div>
          )}
        </div>
        <SearchBar />
        <div className="header-actions">
          <button 
            className="add-widget-btn"
            onClick={() => dispatch(setShowAddWidget(true))}
          >
            Add Widget +
          </button>
          <button className="menu-btn" onClick={handleMenu}>⋮</button>
          <TimeRangeSelector />
        </div>
      </div>
      
      {currentAlert && (
        <div className={`security-alert alert-${currentAlert.type}`}>
          <span className="alert-category">[{currentAlert.category}]</span>
          <span className="alert-message">{currentAlert.message}</span>
          <button className="alert-close" onClick={() => setCurrentAlert(null)}>×</button>
        </div>
      )}
      
      <div className="dashboard-content">
        {filteredCategories.length === 0 && searchTerm ? (
          <div className="no-results">
            <p>No results found for "{searchTerm}"</p>
          </div>
        ) : (
          filteredCategories.map(category => (
            <Category 
              key={category.id} 
              category={category} 
              onAddWidget={handleAddWidget}
              onAddDefaultWidget={handleAddDefaultWidget}
            />
          ))
        )}
      </div>
      
      {showAddWidget && <AddWidgetModal />}
      </div>
    </InteractiveDashboard>
  );
};

export default Dashboard;