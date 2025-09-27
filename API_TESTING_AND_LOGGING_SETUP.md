# API Testing and Logging Setup - Complete Guide

This guide provides everything you need to test your Expense Tracker API and implement comprehensive logging.

## 📁 Files Created

### Logging Configuration
1. **`backend/src/main/resources/logback-spring.xml`** - Logback configuration with multiple appenders
2. **`backend/src/main/java/com/expensetracker/config/LoggingConfig.java`** - Request logging interceptor
3. **`LOGGING_SETUP_README.md`** - Detailed logging implementation guide

### Postman Collection & Environment
4. **`Expense_Tracker_API_Postman_Collection.json`** - Complete API collection
5. **`Expense_Tracker_Postman_Environment.json`** - Environment variables for testing

## 🚀 Quick Start

### 1. Setup Backend with Logging

Add these dependencies to your `pom.xml`:

```xml
<!-- Logging Dependencies -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### 2. Start Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Select "Expense_Tracker_API_Postman_Collection.json"
4. Import "Expense_Tracker_Postman_Environment.json" as environment

### 4. Test the API

1. **Register a user**:
   - Use "Register User" request
   - Body: `{"username": "testuser", "email": "test@example.com", "password": "password123"}`

2. **Login**:
   - Use "Login User" request
   - The JWT token will be automatically saved to environment

3. **Test other endpoints**:
   - All requests will use the saved JWT token automatically
   - Try creating, updating, and deleting expenses

## 📊 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)

### Categories
- `GET /api/categories` - Get all categories

### Expenses (Protected - Requires JWT)
- `GET /api/expenses` - Get all user expenses
- `GET /api/expenses/{id}` - Get specific expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `GET /api/expenses/summary` - Get expense summary

### Health Check
- `GET /actuator/health` - Application health
- `GET /actuator/info` - Application info

## 📝 Logging Features

### What Gets Logged
- ✅ All API requests with client IP, user agent, session info
- ✅ Response status codes and processing times
- ✅ Authentication attempts (success/failure)
- ✅ User registration events
- ✅ Expense CRUD operations
- ✅ Security events
- ✅ Application errors with stack traces

### Log Files Created
- `logs/expense-tracker.log` - Main application logs
- `logs/security.log` - Security events only
- `logs/errors.log` - Error logs only

### Log Levels
- **INFO**: General application flow (recommended for production)
- **DEBUG**: Detailed debugging information
- **WARN**: Warning conditions
- **ERROR**: Error conditions

## 🔧 Adding Logging to Controllers

### Basic Pattern

```java
@RestController
public class YourController {

    private static final Logger logger = LoggerFactory.getLogger(YourController.class);

    @GetMapping("/your-endpoint")
    public ResponseEntity<?> yourMethod() {
        logger.info("Processing request for user: {}", username);

        try {
            // Your business logic
            logger.info("Successfully processed request");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing request", e);
            return ResponseEntity.status(500).body("Error occurred");
        }
    }
}
```

## 🧪 Testing Examples

### Sample Test Flow

1. **Register User**
   ```json
   POST /api/auth/register
   {
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
   }
   ```

2. **Login User**
   ```json
   POST /api/auth/login
   {
       "username": "testuser",
       "password": "password123"
   }
   ```

3. **Create Expense**
   ```json
   POST /api/expenses
   Authorization: Bearer YOUR_JWT_TOKEN
   {
       "title": "Office Supplies",
       "amount": 150.75,
       "description": "Bought printer paper",
       "categoryId": 1,
       "date": "2024-01-15"
   }
   ```

## 📈 Monitoring

### Check Application Health
- Visit: `http://localhost:8080/actuator/health`

### View Logs
- Console output (colored logs)
- File logs in `logs/` directory
- Security logs in `logs/security.log`

### Performance Metrics
- Request processing times are logged
- Response status codes tracked
- Error rates monitored

## 🛠️ Troubleshooting

### Common Issues

1. **JWT Token Issues**
   - Make sure to run "Login User" first
   - Check if token is saved in environment variables

2. **CORS Issues**
   - Backend allows all origins (`*`)
   - Check browser console for CORS errors

3. **Logging Not Working**
   - Ensure logback-spring.xml is in resources folder
   - Check console for any configuration errors

4. **Dependencies Missing**
   - Run `mvn clean install` after adding dependencies
   - Restart the application

## 📚 Additional Resources

- [Spring Boot Logging Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.logging)
- [Logback Configuration](https://logback.qos.ch/documentation.html)
- [Postman Documentation](https://learning.postman.com/docs/getting-started/introduction/)
- [JWT Authentication Guide](https://jwt.io/introduction/)

## 🎯 Next Steps

1. Implement logging in your controllers using the provided examples
2. Test all API endpoints with the Postman collection
3. Monitor logs during development and testing
4. Adjust log levels based on your environment (DEBUG for dev, INFO for prod)
5. Set up log rotation for production deployment

This setup provides comprehensive API testing capabilities and detailed logging for monitoring your application's behavior and security.
