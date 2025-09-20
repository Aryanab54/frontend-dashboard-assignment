import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeCategory, setShowAddWidget, setSelectedCategory } from '../store/dashboardSlice';
import Widget from './Widget';
import './Category.css';

const Category = ({ category, onAddWidget, onAddDefaultWidget }) => {
  const dispatch = useDispatch();
  const { widgetVisibility } = useSelector(state => state.dashboard);
  
  const visibleWidgets = category.widgets.filter(widget => {
    const key = `${category.id}-${widget.id}`;
    return widgetVisibility[key] !== false;
  });

  const handleRemoveCategory = () => {
    if (window.confirm(`Remove category "${category.name}"?`)) {
      dispatch(removeCategory(category.id));
    }
  };

  const handleAddWidget = () => {
    dispatch(setSelectedCategory(category.id));
    dispatch(setShowAddWidget(true));
  };

  return (
    <div className="category">
      <div className="category-header">
        <h2 className="category-title">{category.name}</h2>
        <button className="remove-category-btn" onClick={handleRemoveCategory}>
          ×
        </button>
      </div>
      <div className="widgets-grid">
        {visibleWidgets.map(widget => (
          <Widget 
            key={widget.id} 
            widget={widget} 
            categoryId={category.id}
          />
        ))}
        <div className="add-widget-card" onClick={handleAddWidget}>
          <div className="add-widget-content">
            <span className="add-icon">+</span>
            <span>Add Widget</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;