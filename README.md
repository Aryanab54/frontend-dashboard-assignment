# Frontend Dashboard Assignment

A dynamic dashboard application built with React and Redux that allows users to manage widgets across different categories.

## Features

- **Dynamic Widget Management**: Add and remove widgets from categories
- **Search Functionality**: Search through all widgets
- **Category-based Organization**: Widgets organized in CSPM, CWPP, Registry Scan, and Incident Management categories
- **Modal Interface**: Clean modal for adding new widgets
- **State Management**: Redux Toolkit for efficient state management
- **Data Persistence**: localStorage integration - changes survive page refresh
- **Visual Charts**: Donut and bar charts for security metrics
- **Time Range Selector**: Dynamic data updates based on selected time periods
- **Reset Functionality**: Reset dashboard to default state

## Technologies Used

- React 19.1.1
- Redux Toolkit
- React Icons
- CSS3
- localStorage API for data persistence

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-dashboard-assignment
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.js          # Main dashboard component
│   │   ├── Category.js           # Category container component
│   │   ├── Widget.js             # Individual widget component
│   │   ├── SearchBar.js          # Search functionality
│   │   ├── AddWidgetModal.js     # Modal for adding widgets
│   │   └── *.css                 # Component styles
│   ├── store/
│   │   ├── store.js              # Redux store configuration
│   │   └── dashboardSlice.js     # Dashboard state management
│   ├── App.js                    # Main app component
│   └── index.js                  # App entry point
└── package.json
```

## Usage

### Adding Widgets
1. Click "Add Widget +" button in the header OR
2. Click the "+ Add Widget" card in any category
3. Fill in widget name and text in the modal
4. Click "Confirm" to add the widget

### Removing Widgets
1. Click the "×" button on any widget to remove it

### Searching Widgets
1. Use the search bar at the top to filter widgets by name

### Time Range Selection
1. Use the time range dropdown to view data for different periods
2. Available ranges: 1 hour, 24 hours, Last 2 days, 7 days, 30 days

### Reset Dashboard
1. Click the "🔄 Reset" button in the dashboard controls
2. Confirm to reset dashboard to default state
3. This clears all custom widgets and localStorage data

### Data Persistence
- All changes are automatically saved to localStorage
- Dashboard state persists across page refreshes and browser sessions
- Use reset button to clear saved data

## JSON Data Structure

The application uses the following JSON structure for categories and widgets:

```json
{
  "categories": [
    {
      "id": "cspm",
      "name": "CSPM Executive Dashboard",
      "widgets": [
        {
          "id": "cloud-accounts",
          "name": "Cloud Accounts",
          "type": "donut",
          "data": { "connected": 2, "notConnected": 2, "total": 4 }
        }
      ]
    },
    {
      "id": "ticket",
      "name": "Incident Management",
      "widgets": [
        {
          "id": "open-tickets",
          "name": "Open Security Tickets",
          "type": "donut",
          "data": {
            "critical": 63,
            "high": 86,
            "medium": 112,
            "low": 41,
            "total": 302
          }
        }
      ]
    }
  ]
}
```

## Data Persistence

The application automatically saves all dashboard state to localStorage:
- Widget additions/removals
- Search terms
- Time range selections
- Category modifications

Data persists across browser sessions and page refreshes.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Browser Support

This application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)