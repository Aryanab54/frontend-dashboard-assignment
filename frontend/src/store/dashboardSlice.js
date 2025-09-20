import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  widgetVisibility: {},
  timeRange: 'Last 2 days',
  categories: [
    {
      id: 'cspm',
      name: 'CSPM Executive Dashboard',
      widgets: [
        { 
          id: 'cloud-accounts', 
          name: 'Cloud Accounts', 
          type: 'donut',
          data: { connected: 2, notConnected: 2, total: 2 }
        },
        { 
          id: 'risk-assessment', 
          name: 'Cloud Account Risk Assessment', 
          type: 'donut',
          data: { 
            total: 9659,
            failed: 1689,
            warning: 681,
            notAvailable: 36,
            passed: 7253
          }
        }
      ]
    },
    {
      id: 'cwpp',
      name: 'CWPP Dashboard',
      widgets: [
        { 
          id: 'namespace-alerts', 
          name: 'Top 5 Namespace Specific Alerts', 
          type: 'empty',
          text: 'No Graph data available!'
        },
        { 
          id: 'workload-alerts', 
          name: 'Workload Alerts', 
          type: 'empty',
          text: 'No Graph data available!'
        }
      ]
    },
    {
      id: 'registry',
      name: 'Registry Scan',
      widgets: [
        { 
          id: 'image-risk', 
          name: 'Image Risk Assessment', 
          type: 'bar',
          data: { 
            total: 1470,
            critical: 9,
            high: 150
          }
        },
        { 
          id: 'image-security', 
          name: 'Image Security Issues', 
          type: 'bar',
          data: { 
            total: 2,
            critical: 2,
            high: 2
          }
        }
      ]
    },
    {
      id: 'ticket',
      name: 'Incident Management',
      widgets: [
        { 
          id: 'open-tickets', 
          name: 'Open Security Tickets', 
          type: 'donut',
          data: { 
            total: 302,
            critical: 63,
            high: 86,
            medium: 112,
            low: 41
          }
        },
        { 
          id: 'sla-compliance', 
          name: 'SLA Compliance', 
          type: 'bar',
          data: { 
            total: 156,
            critical: 12,
            high: 28
          }
        }
      ]
    }
  ],
  searchTerm: '',
  showAddWidget: false,
  selectedCategory: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addWidget: (state, action) => {
      const { categoryId, widget } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets.push(widget);
      }
    },
    removeWidget: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets = category.widgets.filter(widget => widget.id !== widgetId);
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setShowAddWidget: (state, action) => {
      state.showAddWidget = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    addCategory: (state, action) => {
      const newCategory = {
        id: Date.now().toString(),
        name: action.payload,
        widgets: []
      };
      state.categories.push(newCategory);
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    },
    addDefaultWidget: (state, action) => {
      const { categoryId, widget } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets.push(widget);
      }
    },
    updateTimeRange: (state, action) => {
      const { range } = action.payload;
      state.timeRange = range;
      
      // Generate time-based multipliers
      const multipliers = {
        '1 hour': 0.1,
        '24 hours': 1,
        'Last 2 days': 2,
        '7 days': 7,
        '30 days': 30
      };
      
      const multiplier = multipliers[range] || 1;
      
      // Update all widgets with time-based data
      state.categories.forEach(category => {
        category.widgets.forEach(widget => {
          if (widget.type === 'donut' && widget.data.medium !== undefined) {
            // Ticket widgets with critical/high/medium/low structure
            const baseCritical = 63;
            const baseHigh = 86;
            const baseMedium = 112;
            const baseLow = 41;
            
            const newData = {
              critical: Math.floor(baseCritical * multiplier * (0.8 + Math.random() * 0.4)),
              high: Math.floor(baseHigh * multiplier * (0.8 + Math.random() * 0.4)),
              medium: Math.floor(baseMedium * multiplier * (0.8 + Math.random() * 0.4)),
              low: Math.floor(baseLow * multiplier * (0.8 + Math.random() * 0.4)),
              total: 0
            };
            newData.total = newData.critical + newData.high + newData.medium + newData.low;
            widget.data = newData;
            console.log('Updated ticket widget:', widget.name, widget.data);
          } else if (widget.type === 'donut' && widget.data.failed !== undefined) {
            // Security assessment widgets
            const baseFailed = 240;
            const baseWarning = 95;
            const basePassed = 1050;
            const baseNotAvailable = 15;
            
            widget.data = {
              failed: Math.floor(baseFailed * multiplier * (0.8 + Math.random() * 0.4)),
              warning: Math.floor(baseWarning * multiplier * (0.8 + Math.random() * 0.4)),
              passed: Math.floor(basePassed * multiplier * (0.8 + Math.random() * 0.4)),
              notAvailable: Math.floor(baseNotAvailable * multiplier * (0.8 + Math.random() * 0.4)),
              total: 0
            };
            widget.data.total = widget.data.failed + widget.data.warning + widget.data.passed + widget.data.notAvailable;
          } else if (widget.type === 'donut' && widget.data.connected !== undefined) {
            // Connection status widgets
            const baseConnected = 8;
            const baseNotConnected = 3;
            
            widget.data = {
              connected: Math.max(1, Math.floor(baseConnected * Math.sqrt(multiplier) * (0.8 + Math.random() * 0.4))),
              notConnected: Math.max(0, Math.floor(baseNotConnected * Math.sqrt(multiplier) * (0.8 + Math.random() * 0.4))),
              total: 0
            };
            widget.data.total = widget.data.connected + widget.data.notConnected;
          } else if (widget.type === 'bar') {
            // Vulnerability bar charts
            const baseTotal = 200;
            const baseCritical = 15;
            const baseHigh = 45;
            
            widget.data = {
              total: Math.floor(baseTotal * multiplier * (0.8 + Math.random() * 0.4)),
              critical: Math.floor(baseCritical * multiplier * (0.8 + Math.random() * 0.4)),
              high: Math.floor(baseHigh * multiplier * (0.8 + Math.random() * 0.4))
            };
          }
        });
      });
    },
    toggleWidgetVisibility: (state, action) => {
      const { categoryId, widgetId, visible } = action.payload;
      const key = `${categoryId}-${widgetId}`;
      state.widgetVisibility[key] = visible;
    }
  }
});

export const { addWidget, removeWidget, setSearchTerm, setShowAddWidget, setSelectedCategory, addCategory, removeCategory, addDefaultWidget, updateTimeRange, toggleWidgetVisibility } = dashboardSlice.actions;
export default dashboardSlice.reducer;