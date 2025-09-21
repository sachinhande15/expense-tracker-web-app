# Frontend - React Expense Tracker

This is the React frontend application for the Expense Tracker project.

## Project Structure

```
frontend/
├── src/                    # React source code
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── styles/             # CSS styles
│   ├── types/              # TypeScript definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── build/                  # Production build (generated)
├── node_modules/           # Dependencies (generated)
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

### Development

1. Start the development server:
   ```bash
   cd frontend
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Features

- User authentication (Login/Signup)
- Dashboard with expense overview
- Add, edit, delete expenses
- Category management
- Data visualization with charts
- Responsive design with Material-UI

## API Integration

The frontend communicates with the Spring Boot backend API. Make sure the backend is running on the configured port (default: 8080).
