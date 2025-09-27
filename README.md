# Expense Tracker - Full Stack Application

A comprehensive expense tracking application built with React frontend and Spring Boot backend.

## Project Structure

```
expence-tracker/
├── frontend/               # React frontend application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── build/             # Production build
│   ├── node_modules/      # Dependencies
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
├── backend/               # Spring Boot backend application
│   ├── src/               # Java source code
│   ├── target/            # Build output
│   ├── pom.xml            # Maven dependencies
│   └── application.properties
├── .gitignore
├── TODO.md
└── README.md              # This file
```

## Technologies Used

### Frontend
- **React** 19.1.1 - UI framework
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Toastify** - Notifications

### Backend
- **Spring Boot** - Java framework
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Database access
- **Maven** - Dependency management

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- Java 11 or higher
- Maven 3.6 or higher

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

3. The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Features

### User Management
- User registration and login
- JWT-based authentication
- Secure password handling

### Expense Management
- Add, edit, delete expenses
- Category-based organization
- Date-based filtering
- Expense summaries and reports

### Data Visualization
- Interactive charts and graphs
- Monthly expense breakdowns
- Category-wise expense analysis

### Responsive Design
- Mobile-friendly interface
- Material-UI components
- Modern, clean design

## API Endpoints

The backend provides RESTful APIs for:
- `/api/auth` - Authentication endpoints
- `/api/expenses` - Expense management
- `/api/categories` - Category management

## Development

### Running Tests
- Frontend: `cd frontend && npm test`
- Backend: `cd backend && mvn test`

### Building for Production
- Frontend: `cd frontend && npm run build`
- Backend: `cd backend && mvn clean package`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
