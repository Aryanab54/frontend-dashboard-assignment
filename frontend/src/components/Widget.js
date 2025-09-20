import React from 'react';
import { useDispatch } from 'react-redux';
import { removeWidget } from '../store/dashboardSlice';
import { IoClose } from 'react-icons/io5';
import ImprovedDonut from './ImprovedDonut';
import './Widget.css';

const DonutChart = ({ data, type, widgetId }) => {
  if (type === 'cloud-accounts' || widgetId === 'cloud-accounts' || (data.connected !== undefined && data.notConnected !== undefined)) {
    return (
      <div className="chart-container">
        <div className="donut-chart blue">
          <div className="donut-center">
            <div className="center-number">{data.total}</div>
            <div className="center-label">Total</div>
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
  
  if (type === 'risk-assessment') {
    return (
      <div className="chart-container">
        <div className="donut-chart multicolor">
          <div className="donut-center">
            <div className="center-number">{data.total}</div>
            <div className="center-label">Total</div>
          </div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot red"></span>
            <span>Failed ({data.failed})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot orange"></span>
            <span>Warning ({data.warning})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot gray"></span>
            <span>Not available ({data.notAvailable})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot green"></span>
            <span>Passed ({data.passed})</span>
          </div>
        </div>
      </div>
    );
  }
};

const BarChart = ({ data, widgetId }) => {
  return (
    <div className="bar-chart-container">
      <div className="bar-total">
        <span className="bar-number">{data.total}</span>
        <span className="bar-label">Total {widgetId === 'image-risk' ? 'Vulnerabilities' : 'Images'}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-segment red" style={{width: '20%'}}></div>
        <div className="progress-segment orange" style={{width: '30%'}}></div>
        <div className="progress-segment yellow" style={{width: '25%'}}></div>
        <div className="progress-segment gray" style={{width: '25%'}}></div>
      </div>
      <div className="bar-legend">
        <div className="legend-item">
          <span className="legend-dot red"></span>
          <span>Critical ({data.critical})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot orange"></span>
          <span>High ({data.high})</span>
        </div>
      </div>
    </div>
  );
};

const EmptyChart = ({ text }) => {
  return (
    <div className="empty-chart">
      <div className="empty-bar-chart">
        <div className="bar-item" style={{height: '60%'}}></div>
        <div className="bar-item" style={{height: '40%'}}></div>
        <div className="bar-item" style={{height: '80%'}}></div>
        <div className="bar-item" style={{height: '30%'}}></div>
        <div className="bar-item" style={{height: '70%'}}></div>
      </div>
      <div className="empty-text">{text}</div>
    </div>
  );
};

const Widget = ({ widget, categoryId }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeWidget({ categoryId, widgetId: widget.id }));
  };

  const renderContent = () => {
    if (widget.type === 'donut') {
      return <ImprovedDonut data={widget.data} type={widget.id} />;
    }
    if (widget.type === 'bar') {
      return <BarChart data={widget.data} widgetId={widget.id} />;
    }
    if (widget.type === 'empty') {
      return <EmptyChart text={widget.text} />;
    }
    if (widget.type === 'text' || widget.text) {
      return <p>{widget.text}</p>;
    }
    return <p>No content available</p>;
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <h3 className="widget-title">{widget.name}</h3>
        <button className="remove-btn" onClick={handleRemove}>
          <IoClose />
        </button>
      </div>
      <div className="widget-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Widget;