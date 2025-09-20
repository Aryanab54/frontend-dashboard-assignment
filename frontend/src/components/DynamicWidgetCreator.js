import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addWidget } from '../store/dashboardSlice';
import { IoClose } from 'react-icons/io5';
import './DynamicWidgetCreator.css';

const DynamicWidgetCreator = ({ categoryId, onClose }) => {
  const dispatch = useDispatch();
  const [widgetType, setWidgetType] = useState('donut');
  const [widgetName, setWidgetName] = useState('');
  const [formData, setFormData] = useState({
    // Donut chart data
    connected: '',
    notConnected: '',
    failed: '',
    warning: '',
    passed: '',
    notAvailable: '',
    // Bar chart data
    total: '',
    critical: '',
    high: '',
    // Text data
    customText: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createWidget = () => {
    if (!widgetName.trim()) {
      alert('Please enter a widget name');
      return;
    }

    let widgetData = {};
    
    if (widgetType === 'donut') {
      // Check if it's connection-type or security-type donut
      if (formData.connected && formData.notConnected) {
        const connected = parseInt(formData.connected) || 0;
        const notConnected = parseInt(formData.notConnected) || 0;
        widgetData = {
          type: 'donut',
          data: {
            connected,
            notConnected,
            total: connected + notConnected
          }
        };
      } else if (formData.failed && formData.warning && formData.passed) {
        const failed = parseInt(formData.failed) || 0;
        const warning = parseInt(formData.warning) || 0;
        const passed = parseInt(formData.passed) || 0;
        const notAvailable = parseInt(formData.notAvailable) || 0;
        widgetData = {
          type: 'donut',
          data: {
            failed,
            warning,
            passed,
            notAvailable,
            total: failed + warning + passed + notAvailable
          }
        };
      } else {
        alert('Please fill all required fields for donut chart');
        return;
      }
    } else if (widgetType === 'bar') {
      const total = parseInt(formData.total) || 0;
      const critical = parseInt(formData.critical) || 0;
      const high = parseInt(formData.high) || 0;
      
      if (!total || !critical || !high) {
        alert('Please fill all required fields for bar chart');
        return;
      }
      
      widgetData = {
        type: 'bar',
        data: { total, critical, high }
      };
    } else if (widgetType === 'empty') {
      widgetData = {
        type: 'empty',
        text: formData.customText || 'No data available!'
      };
    }

    const newWidget = {
      id: Date.now().toString(),
      name: widgetName,
      ...widgetData
    };

    dispatch(addWidget({ categoryId, widget: newWidget }));
    onClose();
  };

  return (
    <div className="widget-creator-overlay">
      <div className="widget-creator">
        <div className="creator-header">
          <h3>Create Custom Widget</h3>
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="creator-content">
          <div className="form-group">
            <label>Widget Name *</label>
            <input
              type="text"
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              placeholder="Enter widget name"
            />
          </div>

          <div className="form-group">
            <label>Widget Type *</label>
            <select value={widgetType} onChange={(e) => setWidgetType(e.target.value)}>
              <option value="donut">Donut Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="empty">Empty State</option>
            </select>
          </div>

          {widgetType === 'donut' && (
            <div className="chart-options">
              <div className="option-tabs">
                <button 
                  className="tab-btn active"
                  onClick={() => setFormData({...formData, chartSubType: 'connection'})}
                >
                  Connection Status
                </button>
                <button 
                  className="tab-btn"
                  onClick={() => setFormData({...formData, chartSubType: 'security'})}
                >
                  Security Assessment
                </button>
              </div>

              {!formData.chartSubType || formData.chartSubType === 'connection' ? (
                <div className="connection-inputs">
                  <div className="input-row">
                    <div className="form-group">
                      <label>Connected Count *</label>
                      <input
                        type="number"
                        value={formData.connected}
                        onChange={(e) => handleInputChange('connected', e.target.value)}
                        placeholder="e.g., 5"
                      />
                    </div>
                    <div className="form-group">
                      <label>Not Connected Count *</label>
                      <input
                        type="number"
                        value={formData.notConnected}
                        onChange={(e) => handleInputChange('notConnected', e.target.value)}
                        placeholder="e.g., 3"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="security-inputs">
                  <div className="input-row">
                    <div className="form-group">
                      <label>Failed *</label>
                      <input
                        type="number"
                        value={formData.failed}
                        onChange={(e) => handleInputChange('failed', e.target.value)}
                        placeholder="e.g., 150"
                      />
                    </div>
                    <div className="form-group">
                      <label>Warning *</label>
                      <input
                        type="number"
                        value={formData.warning}
                        onChange={(e) => handleInputChange('warning', e.target.value)}
                        placeholder="e.g., 75"
                      />
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="form-group">
                      <label>Passed *</label>
                      <input
                        type="number"
                        value={formData.passed}
                        onChange={(e) => handleInputChange('passed', e.target.value)}
                        placeholder="e.g., 500"
                      />
                    </div>
                    <div className="form-group">
                      <label>Not Available</label>
                      <input
                        type="number"
                        value={formData.notAvailable}
                        onChange={(e) => handleInputChange('notAvailable', e.target.value)}
                        placeholder="e.g., 25"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {widgetType === 'bar' && (
            <div className="bar-inputs">
              <div className="input-row">
                <div className="form-group">
                  <label>Total Count *</label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => handleInputChange('total', e.target.value)}
                    placeholder="e.g., 1000"
                  />
                </div>
                <div className="form-group">
                  <label>Critical Issues *</label>
                  <input
                    type="number"
                    value={formData.critical}
                    onChange={(e) => handleInputChange('critical', e.target.value)}
                    placeholder="e.g., 25"
                  />
                </div>
              </div>
              <div className="input-row">
                <div className="form-group">
                  <label>High Priority *</label>
                  <input
                    type="number"
                    value={formData.high}
                    onChange={(e) => handleInputChange('high', e.target.value)}
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>
          )}

          {widgetType === 'empty' && (
            <div className="form-group">
              <label>Custom Message</label>
              <textarea
                value={formData.customText}
                onChange={(e) => handleInputChange('customText', e.target.value)}
                placeholder="Enter custom message for empty state"
                rows="3"
              />
            </div>
          )}

          <div className="preview-section">
            <h4>Preview:</h4>
            <div className="widget-preview">
              {widgetName || 'Your Widget Name'}
              <div className="preview-chart">
                {widgetType === 'donut' && '🍩 Donut Chart'}
                {widgetType === 'bar' && '📊 Bar Chart'}
                {widgetType === 'empty' && '📋 Empty State'}
              </div>
            </div>
          </div>
        </div>

        <div className="creator-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="create-btn" onClick={createWidget}>Create Widget</button>
        </div>
      </div>
    </div>
  );
};

export default DynamicWidgetCreator;