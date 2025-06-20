# CyberSec Password Suite - Full Stack Application

A professional cybersecurity tool suite built with React, Node.js, Express, and MongoDB. This application provides comprehensive password analysis, secure password generation, cryptographic hash operations, and security monitoring capabilities.

## 🚀 Features

### Frontend (React + TypeScript)
- **Password Security Analyzer**: Real-time password strength analysis with entropy calculation
- **Secure Password Generator**: Cryptographically secure password generation with customizable options
- **Hash Generator & Verifier**: Support for MD5, SHA-1, SHA-256, SHA-512, and bcrypt
- **Security Dashboard**: Analytics and insights into security activities
- **User Authentication**: Secure login/register with JWT tokens
- **Responsive Design**: Modern UI with Tailwind CSS and smooth animations

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Comprehensive API endpoints for all features
- **User Management**: Registration, authentication, and profile management
- **Password Analysis**: Advanced password security analysis with pattern detection
- **Hash Operations**: Secure hash generation and verification
- **Security Monitoring**: Event logging and security analytics
- **Rate Limiting**: API rate limiting and abuse prevention
- **Data Persistence**: MongoDB for storing user data and analytics

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API communication
- Vite for development and building

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- crypto-js for cryptographic operations
- Helmet for security headers
- CORS for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cybersec-password-suite
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

Required environment variables:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/cybersec_suite

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### 5. Start the Application
```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only  
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Password Operations
- `POST /api/passwords/analyze` - Analyze password strength
- `POST /api/passwords/generate` - Generate secure passwords
- `GET /api/passwords/history` - Get password analysis history
- `GET /api/passwords/stats` - Get password statistics

### Hash Operations
- `POST /api/hashes/generate` - Generate hash
- `POST /api/hashes/verify` - Verify hash
- `POST /api/hashes/compare` - Compare multiple hashes
- `GET /api/hashes/history` - Get hash operation history
- `GET /api/hashes/stats` - Get hash statistics

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/security-insights` - Security insights
- `GET /api/analytics/system` - System-wide analytics (admin)

### Security
- `GET /api/security/events` - Get security events
- `GET /api/security/dashboard` - Security dashboard
- `PUT /api/security/settings` - Update security settings

## 🔒 Security Features

### Password Analysis
- Entropy calculation
- Pattern detection (keyboard patterns, sequences, etc.)
- Dictionary word detection
- Leet speak detection
- Personal information detection
- Breach database checking simulation

### Hash Security
- Multiple hash algorithms (MD5, SHA-1, SHA-256, SHA-512, bcrypt)
- Salt generation for bcrypt
- Execution time monitoring
- Security level assessment

### Application Security
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting per IP
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Security event logging
- CORS configuration
- Helmet security headers

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String,
  profile: {
    firstName: String,
    lastName: String,
    company: String,
    jobTitle: String
  },
  securitySettings: {
    twoFactorEnabled: Boolean,
    lastPasswordChange: Date,
    loginAttempts: Number,
    lockUntil: Date
  },
  apiUsage: {
    requestCount: Number,
    lastRequest: Date,
    monthlyLimit: Number
  }
}
```

### Password Analysis Collection
```javascript
{
  userId: ObjectId,
  passwordHash: String,
  analysis: {
    score: Number,
    entropy: Number,
    strength: String,
    // ... other analysis data
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    timestamp: Date
  }
}
```

### Security Events Collection
```javascript
{
  userId: ObjectId,
  eventType: String,
  severity: String,
  description: String,
  metadata: {
    ipAddress: String,
    userAgent: String,
    // ... other metadata
  },
  resolved: Boolean
}
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cybersec_suite
JWT_SECRET=your_production_jwt_secret
VITE_API_URL=https://your-domain.com/api
```

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint
```

## 📈 Performance Considerations

- Database indexing on frequently queried fields
- API rate limiting to prevent abuse
- Efficient password analysis algorithms
- Caching for repeated operations
- Optimized MongoDB queries with aggregation pipelines

## 🔐 Security Considerations

- Never store plain text passwords
- Use environment variables for sensitive data
- Implement proper input validation
- Regular security audits
- Monitor for suspicious activities
- Keep dependencies updated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Version History

- **v1.0.0** - Initial release with full-stack implementation
  - User authentication and authorization
  - Password analysis and generation
  - Hash operations
  - Security monitoring
  - Analytics dashboard

---

**Built with ❤️ for cybersecurity professionals**