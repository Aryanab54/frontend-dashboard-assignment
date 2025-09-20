import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addWidget, setShowAddWidget, setSelectedCategory, toggleWidgetVisibility } from '../store/dashboardSlice';
import { IoClose } from 'react-icons/io5';
import './AddWidgetModal.css';

const AddWidgetModal = () => {
  const { categories, selectedCategory, widgetVisibility } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(() => {
    if (selectedCategory === 'cspm') return 'CSPM';
    if (selectedCategory === 'cwpp') return 'CWPP';
    if (selectedCategory === 'registry') return 'Image';
    if (selectedCategory === 'ticket') return 'Ticket';
    return 'CSPM';
  });
  // Use widget visibility directly from Redux
  const isWidgetVisible = (categoryId, widgetId) => {
    const key = `${categoryId}-${widgetId}`;
    return widgetVisibility[key] !== false;
  };

  // Dynamic widget creation states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState('');
  const [widgetType, setWidgetType] = useState('donut');
  const [widgetData, setWidgetData] = useState({
    connected: '',
    notConnected: '',
    failed: '',
    warning: '',
    passed: '',
    notAvailable: '',
    total: '',
    critical: '',
    high: '',
    customText: ''
  });

  const handleClose = () => {
    dispatch(setShowAddWidget(false));
    dispatch(setSelectedCategory(null));
    setShowCreateForm(false);
    setNewWidgetName('');
    setWidgetData({
      connected: '', notConnected: '', failed: '', warning: '', 
      passed: '', notAvailable: '', total: '', critical: '', high: '', customText: ''
    });
  };

  const handleConfirm = () => {
    handleClose();
  };

  const toggleWidget = (categoryId, widgetId) => {
    const currentVisibility = isWidgetVisible(categoryId, widgetId);
    dispatch(toggleWidgetVisibility({ 
      categoryId, 
      widgetId, 
      visible: !currentVisibility 
    }));
  };

  const getWidgetTemplates = (tab) => {
    const templates = {
      'CSPM': [
        { name: 'Cloud Security Score', type: 'donut', dataType: 'security' },
        { name: 'Compliance Status', type: 'donut', dataType: 'connection' },
        { name: 'Policy Violations', type: 'bar', dataType: 'vulnerability' }
      ],
      'CWPP': [
        { name: 'Runtime Threats', type: 'bar', dataType: 'vulnerability' },
        { name: 'Workload Status', type: 'donut', dataType: 'connection' },
        { name: 'Container Alerts', type: 'empty', dataType: 'empty' }
      ],
      'Image': [
        { name: 'Image Vulnerabilities', type: 'bar', dataType: 'vulnerability' },
        { name: 'Registry Health', type: 'donut', dataType: 'security' },
        { name: 'Scan Results', type: 'donut', dataType: 'connection' }
      ],
      'Ticket': [
        { name: 'Open Incidents', type: 'donut', dataType: 'security' },
        { name: 'SLA Performance', type: 'bar', dataType: 'vulnerability' },
        { name: 'Response Times', type: 'donut', dataType: 'connection' }
      ]
    };
    return templates[tab] || templates['CSPM'];
  };

  const createCustomWidget = () => {
    if (!newWidgetName.trim()) {
      alert('Please enter widget name');
      return;
    }

    const targetCategory = selectedCategory || getTabCategory(activeTab);
    let newWidget = { id: Date.now().toString(), name: newWidgetName };

    // Create widget based on type and data
    if (widgetType === 'donut') {
      if (widgetData.connected || widgetData.notConnected) {
        newWidget = {
          ...newWidget,
          type: 'donut',
          data: {
            connected: parseInt(widgetData.connected) || 0,
            notConnected: parseInt(widgetData.notConnected) || 0,
            total: (parseInt(widgetData.connected) || 0) + (parseInt(widgetData.notConnected) || 0)
          }
        };
      } else {
        newWidget = {
          ...newWidget,
          type: 'donut',
          data: {
            failed: parseInt(widgetData.failed) || 0,
            warning: parseInt(widgetData.warning) || 0,
            passed: parseInt(widgetData.passed) || 0,
            notAvailable: parseInt(widgetData.notAvailable) || 0,
            total: (parseInt(widgetData.failed) || 0) + (parseInt(widgetData.warning) || 0) + (parseInt(widgetData.passed) || 0) + (parseInt(widgetData.notAvailable) || 0)
          }
        };
      }
    } else if (widgetType === 'bar') {
      newWidget = {
        ...newWidget,
        type: 'bar',
        data: {
          total: parseInt(widgetData.total) || 100,
          critical: parseInt(widgetData.critical) || 0,
          high: parseInt(widgetData.high) || 0
        }
      };
    } else if (widgetType === 'empty') {
      newWidget = {
        ...newWidget,
        type: 'empty',
        text: widgetData.customText || 'No data available!'
      };
    }

    dispatch(addWidget({ categoryId: targetCategory, widget: newWidget }));
    setShowCreateForm(false);
    setNewWidgetName('');
    setWidgetData({
      connected: '', notConnected: '', failed: '', warning: '', 
      passed: '', notAvailable: '', total: '', critical: '', high: '', customText: ''
    });
  };

  const applyTemplate = (template) => {
    setNewWidgetName(template.name);
    setWidgetType(template.type);
    
    // Set sample data based on template
    if (template.dataType === 'security') {
      setWidgetData({
        ...widgetData,
        failed: '25', warning: '45', passed: '180', notAvailable: '5'
      });
    } else if (template.dataType === 'connection') {
      setWidgetData({
        ...widgetData,
        connected: '8', notConnected: '3'
      });
    } else if (template.dataType === 'vulnerability') {
      setWidgetData({
        ...widgetData,
        total: '150', critical: '12', high: '28'
      });
    }
  };

  const getTabCategory = (tab) => {
    const mapping = { 'CSPM': 'cspm', 'CWPP': 'cwpp', 'Image': 'registry', 'Ticket': 'ticket' };
    return mapping[tab] || 'cspm';
  };

  const getWidgetsForTab = (tab) => {
    const categoryId = getTabCategory(tab);
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.widgets : [];
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add Widget</h2>
          <button className="close-btn" onClick={handleClose}>
            <IoClose />
          </button>
        </div>
        
        <p className="modal-subtitle">Personalise your dashboard by adding the following widget</p>
        
        <div className="tabs">
          {['CSPM', 'CWPP', 'Image', 'Ticket'].map(tab => (
            <button 
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="widget-list">
          {getWidgetsForTab(activeTab).map(widget => (
            <label key={widget.id} className="widget-checkbox">
              <input
                type="checkbox"
                checked={isWidgetVisible(getTabCategory(activeTab), widget.id)}
                onChange={() => toggleWidget(getTabCategory(activeTab), widget.id)}
              />
              {widget.name}
            </label>
          ))}
        </div>

        {!showCreateForm ? (
          <div className="create-widget-section">
            <button 
              className="create-new-btn"
              onClick={() => setShowCreateForm(true)}
            >
              + Create New Widget
            </button>
          </div>
        ) : (
          <div className="create-form">
            <h3>Create Widget for {activeTab}</h3>
            
            <div className="template-section">
              <h4>Quick Templates:</h4>
              <div className="template-grid">
                {getWidgetTemplates(activeTab).map((template, idx) => (
                  <button 
                    key={idx}
                    className="template-btn"
                    onClick={() => applyTemplate(template)}
                  >
                    <span className="template-icon">
                      {template.type === 'donut' ? '🍩' : template.type === 'bar' ? '📊' : '📋'}
                    </span>
                    <span className="template-name">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Widget Name *</label>
              <input
                type="text"
                value={newWidgetName}
                onChange={(e) => setNewWidgetName(e.target.value)}
                placeholder={`Enter ${activeTab} widget name`}
              />
            </div>

            <div className="form-group">
              <label>Widget Type *</label>
              <select value={widgetType} onChange={(e) => setWidgetType(e.target.value)}>
                <option value="donut">Donut Chart - Status/Risk Analysis</option>
                <option value="bar">Bar Chart - Vulnerability/Issue Tracking</option>
                <option value="empty">Empty State - Placeholder/Setup Required</option>
              </select>
            </div>

            {widgetType === 'donut' && (
              <div className="donut-inputs">
                <div className="input-section">
                  <h5>Connection/Status Data:</h5>
                  <div className="input-row">
                    <div className="input-field">
                      <label>Connected/Active</label>
                      <input
                        type="number"
                        placeholder="e.g., 8"
                        value={widgetData.connected}
                        onChange={(e) => setWidgetData({...widgetData, connected: e.target.value})}
                      />
                    </div>
                    <div className="input-field">
                      <label>Disconnected/Inactive</label>
                      <input
                        type="number"
                        placeholder="e.g., 3"
                        value={widgetData.notConnected}
                        onChange={(e) => setWidgetData({...widgetData, notConnected: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="input-section">
                  <h5>Security Assessment Data:</h5>
                  <div className="input-row">
                    <div className="input-field">
                      <label>Failed/Critical</label>
                      <input
                        type="number"
                        placeholder="e.g., 25"
                        value={widgetData.failed}
                        onChange={(e) => setWidgetData({...widgetData, failed: e.target.value})}
                      />
                    </div>
                    <div className="input-field">
                      <label>Warning/Medium</label>
                      <input
                        type="number"
                        placeholder="e.g., 45"
                        value={widgetData.warning}
                        onChange={(e) => setWidgetData({...widgetData, warning: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-field">
                      <label>Passed/Good</label>
                      <input
                        type="number"
                        placeholder="e.g., 180"
                        value={widgetData.passed}
                        onChange={(e) => setWidgetData({...widgetData, passed: e.target.value})}
                      />
                    </div>
                    <div className="input-field">
                      <label>Not Available</label>
                      <input
                        type="number"
                        placeholder="e.g., 5"
                        value={widgetData.notAvailable}
                        onChange={(e) => setWidgetData({...widgetData, notAvailable: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {widgetType === 'bar' && (
              <div className="bar-inputs">
                <h5>Vulnerability/Issue Tracking:</h5>
                <div className="input-row">
                  <div className="input-field">
                    <label>Total Items *</label>
                    <input
                      type="number"
                      placeholder="e.g., 150"
                      value={widgetData.total}
                      onChange={(e) => setWidgetData({...widgetData, total: e.target.value})}
                    />
                  </div>
                  <div className="input-field">
                    <label>Critical Issues *</label>
                    <input
                      type="number"
                      placeholder="e.g., 12"
                      value={widgetData.critical}
                      onChange={(e) => setWidgetData({...widgetData, critical: e.target.value})}
                    />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-field">
                    <label>High Priority *</label>
                    <input
                      type="number"
                      placeholder="e.g., 28"
                      value={widgetData.high}
                      onChange={(e) => setWidgetData({...widgetData, high: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {widgetType === 'empty' && (
              <div className="empty-inputs">
                <div className="form-group">
                  <label>Status Message</label>
                  <textarea
                    value={widgetData.customText}
                    onChange={(e) => setWidgetData({...widgetData, customText: e.target.value})}
                    placeholder="e.g., 'Setup required - Configure monitoring'"
                    rows="3"
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button onClick={() => setShowCreateForm(false)}>Cancel</button>
              <button onClick={createCustomWidget} className="create-btn">Create</button>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;