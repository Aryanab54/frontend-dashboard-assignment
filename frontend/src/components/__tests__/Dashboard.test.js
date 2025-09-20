import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import Dashboard from '../Dashboard';

const renderWithProvider = (component) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('Dashboard Requirements Testing', () => {
  test('1. Dashboard displays all categories dynamically from JSON', () => {
    renderWithProvider(<Dashboard />);
    
    expect(screen.getByText('CSPM Executive Dashboard')).toBeInTheDocument();
    expect(screen.getByText('CWPP Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Registry Scan')).toBeInTheDocument();
  });

  test('2. Each category contains multiple widgets', () => {
    renderWithProvider(<Dashboard />);
    
    expect(screen.getByText('Cloud Accounts')).toBeInTheDocument();
    expect(screen.getByText('Cloud Account Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Top 5 Namespace Specific Alerts')).toBeInTheDocument();
    expect(screen.getByText('Workload Alerts')).toBeInTheDocument();
    expect(screen.getByText('Image Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Image Security Issues')).toBeInTheDocument();
  });

  test('3. Add Widget button opens modal', () => {
    renderWithProvider(<Dashboard />);
    
    const addWidgetBtn = screen.getByText('Add Widget +');
    fireEvent.click(addWidgetBtn);
    
    expect(screen.getByText('Add Widget')).toBeInTheDocument();
    expect(screen.getByText('Personalise your dashboard by adding the following widget')).toBeInTheDocument();
  });

  test('4. Search functionality filters widgets', () => {
    renderWithProvider(<Dashboard />);
    
    const searchInput = screen.getByPlaceholderText('Search anything...');
    fireEvent.change(searchInput, { target: { value: 'Cloud' } });
    
    expect(screen.getByText('Cloud Accounts')).toBeInTheDocument();
    expect(screen.getByText('Cloud Account Risk Assessment')).toBeInTheDocument();
  });

  test('5. Remove widget functionality exists', () => {
    renderWithProvider(<Dashboard />);
    
    const removeButtons = screen.getAllByRole('button');
    const widgetRemoveButtons = removeButtons.filter(btn => 
      btn.querySelector('svg')
    );
    
    expect(widgetRemoveButtons.length).toBeGreaterThan(0);
  });

  test('6. Add Widget cards exist in each category', () => {
    renderWithProvider(<Dashboard />);
    
    const addWidgetCards = screen.getAllByText('Add Widget');
    expect(addWidgetCards.length).toBeGreaterThan(2);
  });
});