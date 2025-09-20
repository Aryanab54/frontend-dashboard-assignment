import React from 'react';
import './ImprovedDonut.css';

const ImprovedDonut = ({ data, type }) => {
  const isConnectionType = data.connected !== undefined;
  const isTicketType = data.critical !== undefined && data.medium !== undefined;
  
  if (isConnectionType) {
    const total = data.connected + data.notConnected;
    const connectedPercentage = (data.connected / total) * 100;
    
    return (
      <div className="chart-container">
        <div className="improved-donut-chart">
          <div 
            className="donut-ring blue-ring"
            style={{
              background: `conic-gradient(
                #4285f4 0deg ${connectedPercentage * 3.6}deg,
                #e8eaed ${connectedPercentage * 3.6}deg 360deg
              )`
            }}
          >
            <div className="donut-center">
              <div className="center-number">{total}</div>
              <div className="center-label">Total</div>
            </div>
          </div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot blue"></span>
            <span>Connected ({data.connected})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot gray"></span>
            <span>Not Connected ({data.notConnected})</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (isTicketType) {
    const { critical, high, medium, low, total } = data;
    const criticalPercentage = (critical / total) * 100;
    const highPercentage = (high / total) * 100;
    const mediumPercentage = (medium / total) * 100;
    const lowPercentage = (low / total) * 100;
    
    const criticalDeg = criticalPercentage * 3.6;
    const highDeg = highPercentage * 3.6;
    const mediumDeg = mediumPercentage * 3.6;
    const lowDeg = lowPercentage * 3.6;
    
    return (
      <div className="chart-container">
        <div className="improved-donut-chart">
          <div 
            className="donut-ring multicolor-ring"
            style={{
              background: `conic-gradient(
                #dc3545 0deg ${criticalDeg}deg,
                #fd7e14 ${criticalDeg}deg ${criticalDeg + highDeg}deg,
                #ffc107 ${criticalDeg + highDeg}deg ${criticalDeg + highDeg + mediumDeg}deg,
                #6c757d ${criticalDeg + highDeg + mediumDeg}deg 360deg
              )`
            }}
          >
            <div className="donut-center">
              <div className="center-number">{total.toLocaleString()}</div>
              <div className="center-label">Total</div>
            </div>
          </div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot red"></span>
            <span>Critical ({critical.toLocaleString()})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot orange"></span>
            <span>High ({high.toLocaleString()})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot yellow"></span>
            <span>Medium ({medium.toLocaleString()})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot gray"></span>
            <span>Low ({low.toLocaleString()})</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Security assessment type
  const failed = data.failed || 0;
  const warning = data.warning || 0;
  const passed = data.passed || 0;
  const notAvailable = data.notAvailable || 0;
  const total = failed + warning + passed + notAvailable;
  const failedPercentage = (failed / total) * 100;
  const warningPercentage = (warning / total) * 100;
  const passedPercentage = (passed / total) * 100;
  const notAvailablePercentage = (notAvailable / total) * 100;
  
  const failedDeg = failedPercentage * 3.6;
  const warningDeg = warningPercentage * 3.6;
  const passedDeg = passedPercentage * 3.6;
  const notAvailableDeg = notAvailablePercentage * 3.6;
  
  return (
    <div className="chart-container">
      <div className="improved-donut-chart">
        <div 
          className="donut-ring multicolor-ring"
          style={{
            background: `conic-gradient(
              #dc3545 0deg ${failedDeg}deg,
              #fd7e14 ${failedDeg}deg ${failedDeg + warningDeg}deg,
              #ffc107 ${failedDeg + warningDeg}deg ${failedDeg + warningDeg + 20}deg,
              #28a745 ${failedDeg + warningDeg + 20}deg 360deg
            )`
          }}
        >
          <div className="donut-center">
            <div className="center-number">{total.toLocaleString()}</div>
            <div className="center-label">Total</div>
          </div>
        </div>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot red"></span>
          <span>Failed ({failed.toLocaleString()})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot orange"></span>
          <span>Warning ({warning.toLocaleString()})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot gray"></span>
          <span>Not available ({notAvailable.toLocaleString()})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot green"></span>
          <span>Passed ({passed.toLocaleString()})</span>
        </div>
      </div>
    </div>
  );
};

export default ImprovedDonut;