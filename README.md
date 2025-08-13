# SafeHire Kenya 🚀

A secure worker hiring platform connecting employers with verified workers in Kenya.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

SafeHire Kenya is a comprehensive platform that bridges the gap between employers and skilled workers. The platform provides secure hiring solutions with built-in verification systems, booking management, and review systems.

### Key Benefits
- **Secure Hiring**: Verified workers and employers
- **Easy Booking**: Streamlined booking process
- **Review System**: Transparent feedback mechanism
- **Category Management**: Organized worker categories
- **Real-time Updates**: Live booking status updates

## ✨ Features

### For Employers
- Browse verified workers by category
- View detailed worker profiles
- Book workers with scheduling
- Rate and review workers
- Manage booking history

### For Workers
- Create professional profiles
- Set availability and rates
- Accept/reject booking requests
- Build reputation through reviews
- Manage earnings and schedule

### For Admins
- User verification management
- Category management
- Platform monitoring
- Dispute resolution

## 🛠 Tech Stack

### Frontend (Client)
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage
- **Nodemailer** - Email notifications

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization

## 📁 Project Structure

```
SafeHireApp/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── landing/    # Landing page components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── ui/         # UI components (buttons, cards, etc.)
│   │   │   └── workers/    # Worker-related components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Node.js application
│   ├── routes/             # API route handlers
│   ├── models/             # Database models
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── config.env          # Environment variables
│   └── package.json        # Backend dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SafeHireApp
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp config.env.example config.env
   
   # Edit environment variables
   nano config.env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if local)
   mongod
   
   # Seed initial data (optional)
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Terminal 1: Start backend server
   cd server
   npm run dev
   
   # Terminal 2: Start frontend development server
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Available Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user profile

#### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user (admin only)

#### Workers
- `GET /workers` - Get all workers
- `GET /workers/:id` - Get worker by ID
- `POST /workers` - Create worker profile
- `PUT /workers/:id` - Update worker profile
- `DELETE /workers/:id` - Delete worker profile

#### Bookings
- `GET /bookings` - Get user's bookings
- `GET /bookings/:id` - Get booking by ID
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking status
- `DELETE /bookings/:id` - Cancel booking

#### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin only)
- `PUT /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)

#### Reviews
- `GET /reviews` - Get reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

## 🔧 Environment Variables

Create a `config.env` file in the server directory:

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

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
```

## 🗄 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin|employer|worker),
  isVerified: Boolean,
  isActive: Boolean,
  profile: {
    phone: String,
    address: String,
    avatar: String
  }
}
```

### Worker Model
```javascript
{
  userId: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  skills: [String],
  experience: String,
  hourlyRate: Number,
  availability: {
    days: [String],
    hours: String
  },
  isAvailable: Boolean,
  rating: Number,
  totalReviews: Number
}
```

### Booking Model
```javascript
{
  employerId: ObjectId (ref: User),
  workerId: ObjectId (ref: Worker),
  categoryId: ObjectId (ref: Category),
  date: Date,
  duration: Number,
  totalAmount: Number,
  status: String (pending|accepted|completed|cancelled),
  description: String,
  location: String
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for API URL

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Database Deployment (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Configure network access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**SafeHire Kenya** - Connecting talent with opportunity in Kenya 🇰🇪
