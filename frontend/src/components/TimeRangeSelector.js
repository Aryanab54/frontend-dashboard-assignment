import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTimeRange } from '../store/dashboardSlice';
import { getTimeRangeData } from '../utils/dashboardLogic';
import './TimeRangeSelector.css';

const TimeRangeSelector = () => {
  const [selectedRange, setSelectedRange] = useState('Last 2 days');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const timeRanges = [
    '1 hour',
    '24 hours', 
    'Last 2 days',
    '7 days',
    '30 days'
  ];

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    setIsOpen(false);
    
    // Update dashboard data based on time range
    dispatch(updateTimeRange({ range }));
  };

  return (
    <div className="time-range-selector">
      <button 
        className="time-select-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="time-icon"></span>
        <span>{selectedRange}</span>
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="time-dropdown">
          {timeRanges.map(range => (
            <div 
              key={range}
              className={`time-option ${range === selectedRange ? 'active' : ''}`}
              onClick={() => handleRangeSelect(range)}
            >
              {range}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector;