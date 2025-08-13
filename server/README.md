# SafeHire Kenya - Backend Server

A secure and scalable backend API for the SafeHire Kenya platform, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Worker Management**: Complete worker profiles with skills, availability, and verification
- **Booking System**: Full booking lifecycle from creation to completion
- **Review System**: Rating and review system for workers and employers
- **Geospatial Queries**: Location-based worker search using MongoDB geospatial indexes
- **File Upload**: Support for document and image uploads (Cloudinary integration ready)
- **Email Notifications**: Email service integration for notifications
- **Rate Limiting**: API rate limiting for security
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **File Upload**: multer, cloudinary
- **Email**: nodemailer
- **Development**: nodemon

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp config.env.example config.env
   ```
   
   Update the `config.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/safehire_kenya
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employer",
  "phone": "+254700123456",
  "location": {
    "county": "Nairobi",
    "city": "Westlands",
    "coordinates": [36.8172, -1.2921]
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Worker Endpoints

#### Get All Workers
```http
GET /workers?page=1&limit=10&category=categoryId&minRate=500&maxRate=2000&rating=4&verified=true&search=cleaner&sortBy=rating&sortOrder=desc
```

#### Get Worker by ID
```http
GET /workers/:id
```

#### Create Worker Profile
```http
POST /workers
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "categoryId",
  "skills": [
    {
      "name": "House Cleaning",
      "level": "expert",
      "yearsOfExperience": 5
    }
  ],
  "hourlyRate": 800,
  "bio": "Professional cleaner with 5+ years experience",
  "documents": {
    "idCard": "https://example.com/id.jpg",
    "policeClearance": "https://example.com/clearance.jpg"
  }
}
```

### Booking Endpoints

#### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "worker": "workerId",
  "title": "House Cleaning",
  "description": "Deep cleaning of 3-bedroom house",
  "scheduledDate": "2024-01-15T10:00:00Z",
  "duration": {
    "hours": 4
  },
  "location": {
    "address": "123 Main St, Nairobi",
    "coordinates": [36.8172, -1.2921]
  },
  "paymentMethod": "mpesa"
}
```

#### Accept/Reject Booking
```http
PUT /bookings/:id/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I'll be there on time!"
}
```

### Category Endpoints

#### Get All Categories
```http
GET /categories?featured=true&active=true
```

### Review Endpoints

#### Submit Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "bookingId",
  "rating": 5,
  "review": "Excellent work, very professional!"
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User
- Basic profile information
- Role-based access (employer, worker, admin)
- Location with geospatial coordinates
- Preferences and settings

### Worker
- Skills and experience
- Hourly rates
- Availability schedule
- Verification status
- Documents and certifications

### Category
- Service categories
- Requirements and tags
- Worker counts and average rates

### Booking
- Job details and scheduling
- Payment information
- Status tracking
- Reviews and ratings

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Environment Variables**: Secure configuration management

## 🧪 Testing

The API includes comprehensive validation and error handling. Test the endpoints using tools like:

- **Postman**
- **Insomnia**
- **curl**
- **Thunder Client** (VS Code extension)

## 📝 Sample Data

After running the seed script, you'll have:

- **8 Service Categories**: House Cleaning, Plumbing, Electrical Work, etc.
- **3 Sample Users**: Employer, Worker, and Admin
- **1 Sample Worker Profile**: Verified house cleaner

### Sample Login Credentials
- **Employer**: john.doe@example.com / password123
- **Worker**: jane.smith@example.com / password123
- **Admin**: admin@safehire.co.ke / admin123

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
EMAIL_HOST=your-smtp-host
EMAIL_USER=your-email
EMAIL_PASS=your-email-password
```

### Deployment Platforms
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**
- **AWS EC2**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

---

**SafeHire Kenya** - Connecting trusted workers with reliable employers across Kenya.

