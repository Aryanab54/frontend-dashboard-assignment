import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeWidget } from '../store/dashboardSlice';
import { IoClose, IoTrendingUp, IoTrendingDown, IoRefresh, IoExpand } from 'react-icons/io5';
import { calculateSecurityScore, generateAlerts, calculateTrends, getRecommendations, formatNumber } from '../utils/dashboardLogic';
import './EnhancedWidget.css';

const EnhancedWidget = ({ widget, categoryId }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (widget.type === 'donut' && widget.data?.failed) {
      setAlerts(generateAlerts());
    }
  }, [widget]);

  const handleRemove = () => {
    if (window.confirm(`Remove "${widget.name}" widget?`)) {
      dispatch(removeWidget({ categoryId, widgetId: widget.id }));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
    if (widget.type === 'donut' && widget.data?.failed) {
      setAlerts(generateAlerts());
    }
  };

  const renderEnhancedDonut = (data, type) => {
    const securityScore = calculateSecurityScore(data);
    const trend = calculateTrends(data.total, data.total * 0.95);
    const recommendations = getRecommendations(data);

    return (
      <div className="enhanced-chart-container">
        <div className="chart-main">
          <div className={`donut-chart ${type === 'cloud-accounts' ? 'blue' : 'multicolor'}`}>
            <div className="donut-center">
              <div className="center-number">{formatNumber(data.total)}</div>
              <div className="center-label">Total</div>
              {securityScore.score && (
                <div className="security-score" style={{color: securityScore.color}}>
                  {securityScore.score}% {securityScore.status}
                </div>
              )}
            </div>
          </div>
          
          <div className="chart-legend">
            {data.failed !== undefined && (
              <>
                <div className="legend-item">
                  <span className="legend-dot red"></span>
                  <span>Failed ({formatNumber(data.failed)})</span>
                  <span className="percentage">{((data.failed/data.total)*100).toFixed(1)}%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot orange"></span>
                  <span>Warning ({formatNumber(data.warning)})</span>
                  <span className="percentage">{((data.warning/data.total)*100).toFixed(1)}%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot green"></span>
                  <span>Passed ({formatNumber(data.passed)})</span>
                  <span className="percentage">{((data.passed/data.total)*100).toFixed(1)}%</span>
                </div>
              </>
            )}
            {data.connected !== undefined && (
              <>
                <div className="legend-item">
                  <span className="legend-dot blue"></span>
                  <span>Connected ({data.connected})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot gray"></span>
                  <span>Not Connected ({data.notConnected})</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="chart-insights">
          <div className="trend-indicator">
            {trend.direction === 'up' ? <IoTrendingUp /> : <IoTrendingDown />}
            <span className={trend.isGood ? 'trend-good' : 'trend-bad'}>
              {trend.percentage}% vs last period
            </span>
          </div>
          
          {recommendations.length > 0 && (
            <div className="recommendations">
              <h5>Recommendations:</h5>
              {recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation">{rec}</div>
              ))}
            </div>
          )}
        </div>

        {alerts.length > 0 && (
          <div className="recent-alerts">
            <h5>Recent Alerts:</h5>
            {alerts.map((alert, idx) => (
              <div key={idx} className={`alert alert-${alert.type}`}>
                <span className="alert-message">{alert.message}</span>
                <span className="alert-time">{alert.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEnhancedBar = (data, widgetId) => {
    const criticalPercentage = (data.critical / data.total) * 100;
    const highPercentage = (data.high / data.total) * 100;
    const trend = calculateTrends(data.total, data.total * 0.9);

    return (
      <div className="enhanced-bar-container">
        <div className="bar-header">
          <div className="bar-total">
            <span className="bar-number">{formatNumber(data.total)}</span>
            <span className="bar-label">Total {widgetId === 'image-risk' ? 'Vulnerabilities' : 'Images'}</span>
          </div>
          <div className="trend-indicator">
            {trend.direction === 'up' ? <IoTrendingUp /> : <IoTrendingDown />}
            <span className={trend.isGood ? 'trend-good' : 'trend-bad'}>
              {trend.percentage}%
            </span>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-segment red" style={{width: `${criticalPercentage}%`}}></div>
          <div className="progress-segment orange" style={{width: `${highPercentage}%`}}></div>
          <div className="progress-segment yellow" style={{width: '25%'}}></div>
          <div className="progress-segment gray" style={{width: '25%'}}></div>
        </div>

        <div className="bar-legend">
          <div className="legend-item">
            <span className="legend-dot red"></span>
            <span>Critical ({data.critical})</span>
            <span className="percentage">{criticalPercentage.toFixed(1)}%</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot orange"></span>
            <span>High ({data.high})</span>
            <span className="percentage">{highPercentage.toFixed(1)}%</span>
          </div>
        </div>

        <div className="severity-breakdown">
          <div className="severity-item critical">
            <span className="severity-count">{data.critical}</span>
            <span className="severity-label">Critical Issues</span>
            <span className="severity-action">Fix Now</span>
          </div>
          <div className="severity-item high">
            <span className="severity-count">{data.high}</span>
            <span className="severity-label">High Priority</span>
            <span className="severity-action">Review Soon</span>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (widget.type === 'donut') {
      return renderEnhancedDonut(widget.data, widget.id);
    }
    if (widget.type === 'bar') {
      return renderEnhancedBar(widget.data, widget.id);
    }
    if (widget.type === 'empty') {
      return (
        <div className="empty-chart">
          <div className="empty-bar-chart">
            <div className="bar-item" style={{height: '60%'}}></div>
            <div className="bar-item" style={{height: '40%'}}></div>
            <div className="bar-item" style={{height: '80%'}}></div>
            <div className="bar-item" style={{height: '30%'}}></div>
            <div className="bar-item" style={{height: '70%'}}></div>
          </div>
          <div className="empty-text">{widget.text}</div>
          <div className="empty-actions">
            <button className="setup-btn">Setup Monitoring</button>
          </div>
        </div>
      );
    }
    return <p>{widget.text}</p>;
  };

  return (
    <div className={`enhanced-widget ${isExpanded ? 'expanded' : ''}`}>
      <div className="widget-header">
        <div className="widget-title-section">
          <h3 className="widget-title">{widget.name}</h3>
          <div className="widget-meta">
            <span className="last-updated">Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="widget-actions">
          <button 
            className="action-btn refresh-btn" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <IoRefresh className={isRefreshing ? 'spinning' : ''} />
          </button>
          <button className="action-btn expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
            <IoExpand />
          </button>
          <button className="action-btn remove-btn" onClick={handleRemove}>
            <IoClose />
          </button>
        </div>
      </div>
      
      <div className="widget-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default EnhancedWidget;