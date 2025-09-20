import React from 'react';
import './ProfessionalCharts.css';

export const ProfessionalDonutChart = ({ data, type }) => {
  const isConnectionType = data.connected !== undefined;
  
  if (isConnectionType) {
    const total = data.connected + data.notConnected;
    const connectedPercentage = (data.connected / total) * 100;
    const strokeDasharray = `${connectedPercentage * 2.51} ${(100 - connectedPercentage) * 2.51}`;
    
    return (
      <div className="professional-chart-container">
        <div className="chart-section">
          <div className="donut-wrapper">
            <svg className="donut-svg" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e8eaed"
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4285f4"
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
                className="animated-stroke"
              />
            </svg>
            <div className="donut-center">
              <div className="center-number">{total}</div>
              <div className="center-label">Total</div>
            </div>
          </div>
        </div>
        
        <div className="legend-section">
          <div className="legend-item">
            <div className="legend-indicator blue"></div>
            <span className="legend-text">Connected ({data.connected})</span>
            <span className="legend-percentage">{connectedPercentage.toFixed(1)}%</span>
          </div>
          <div className="legend-item">
            <div className="legend-indicator gray"></div>
            <span className="legend-text">Not Connected ({data.notConnected})</span>
            <span className="legend-percentage">{(100 - connectedPercentage).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Security assessment type
  const total = data.failed + data.warning + data.passed + (data.notAvailable || 0);
  const failedPercentage = (data.failed / total) * 100;
  const warningPercentage = (data.warning / total) * 100;
  const passedPercentage = (data.passed / total) * 100;
  const notAvailablePercentage = ((data.notAvailable || 0) / total) * 100;
  
  const failedDash = failedPercentage * 2.51;
  const warningDash = warningPercentage * 2.51;
  const passedDash = passedPercentage * 2.51;
  const notAvailableDash = notAvailablePercentage * 2.51;
  
  return (
    <div className="professional-chart-container">
      <div className="chart-section">
        <div className="donut-wrapper">
          <svg className="donut-svg" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e8eaed"
              strokeWidth="12"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#dc3545"
              strokeWidth="12"
              strokeDasharray={`${failedDash} ${251 - failedDash}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
              className="animated-stroke"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#fd7e14"
              strokeWidth="12"
              strokeDasharray={`${warningDash} ${251 - warningDash}`}
              strokeDashoffset={-failedDash}
              transform="rotate(-90 50 50)"
              className="animated-stroke"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#28a745"
              strokeWidth="12"
              strokeDasharray={`${passedDash} ${251 - passedDash}`}
              strokeDashoffset={-(failedDash + warningDash)}
              transform="rotate(-90 50 50)"
              className="animated-stroke"
            />
            {data.notAvailable > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#6c757d"
                strokeWidth="12"
                strokeDasharray={`${notAvailableDash} ${251 - notAvailableDash}`}
                strokeDashoffset={-(failedDash + warningDash + passedDash)}
                transform="rotate(-90 50 50)"
                className="animated-stroke"
              />
            )}
          </svg>
          <div className="donut-center">
            <div className="center-number">{total.toLocaleString()}</div>
            <div className="center-label">Total</div>
          </div>
        </div>
      </div>
      
      <div className="legend-section">
        <div className="legend-item">
          <div className="legend-indicator red"></div>
          <span className="legend-text">Failed ({data.failed.toLocaleString()})</span>
          <span className="legend-percentage">{failedPercentage.toFixed(1)}%</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator orange"></div>
          <span className="legend-text">Warning ({data.warning.toLocaleString()})</span>
          <span className="legend-percentage">{warningPercentage.toFixed(1)}%</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator green"></div>
          <span className="legend-text">Passed ({data.passed.toLocaleString()})</span>
          <span className="legend-percentage">{passedPercentage.toFixed(1)}%</span>
        </div>
        {data.notAvailable > 0 && (
          <div className="legend-item">
            <div className="legend-indicator gray"></div>
            <span className="legend-text">Not Available ({data.notAvailable.toLocaleString()})</span>
            <span className="legend-percentage">{notAvailablePercentage.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfessionalBarChart = ({ data, widgetId }) => {
  const criticalPercentage = (data.critical / data.total) * 100;
  const highPercentage = (data.high / data.total) * 100;
  const mediumPercentage = 25; // Static for visual
  const lowPercentage = 100 - criticalPercentage - highPercentage - mediumPercentage;
  
  return (
    <div className="professional-bar-container">
      <div className="bar-header">
        <div className="bar-total">
          <span className="bar-number">{data.total.toLocaleString()}</span>
          <span className="bar-label">Total {widgetId === 'image-risk' ? 'Vulnerabilities' : 'Images'}</span>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div 
            className="progress-segment critical" 
            style={{width: `${criticalPercentage}%`}}
          ></div>
          <div 
            className="progress-segment high" 
            style={{width: `${highPercentage}%`}}
          ></div>
          <div 
            className="progress-segment medium" 
            style={{width: `${mediumPercentage}%`}}
          ></div>
          <div 
            className="progress-segment low" 
            style={{width: `${lowPercentage}%`}}
          ></div>
        </div>
      </div>
      
      <div className="bar-legend">
        <div className="legend-item">
          <div className="legend-indicator critical"></div>
          <span className="legend-text">Critical ({data.critical})</span>
          <span className="legend-percentage">{criticalPercentage.toFixed(1)}%</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator high"></div>
          <span className="legend-text">High ({data.high})</span>
          <span className="legend-percentage">{highPercentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};