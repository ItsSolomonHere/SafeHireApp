# SafeHire Kenya - MVP

A full-stack MERN web application that connects employers with trusted blue-collar service providers in Kenya.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based authentication with role-based access
- **Worker Categories**: Fundis, Domestic Workers, Boda Boda Riders, Gardeners, Painters, Event Crew, Security Guards, Tutors, Delivery Personnel, Drivers
- **Search & Filter**: Advanced search with location, category, availability, and rate filtering
- **Booking System**: Schedule jobs with calendar integration
- **Messaging**: In-app messaging between verified users
- **Reviews & Ratings**: Worker rating and review system
- **Admin Dashboard**: User management and analytics
- **Multi-language**: English and Swahili support

### User Roles
- **Admin**: Manage users, workers, and bookings
- **Employer**: Search, book, review, and message workers
- **Worker**: Manage profile, availability, and accept/reject bookings

## 🛠️ Tech Stack

### Frontend
- **React 18** with JSX
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API calls
- **React Hook Form** for form handling
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Joi** for validation
- **bcryptjs** for password hashing
- **CORS** and **Helmet** for security

## 📁 Project Structure

```
safehire-kenya/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context providers
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Node.js app
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── server.js         # Main server file
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safehire-kenya
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/safehire-kenya
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

5. **Start the development servers**

   In the server directory:
   ```bash
   npm run dev
   ```

   In the client directory (new terminal):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Workers
- `GET /api/workers/search` - Search workers
- `GET /api/workers/:id` - Get worker by ID
- `POST /api/workers/profile` - Create worker profile
- `PUT /api/workers/profile` - Update worker profile
- `PUT /api/workers/availability` - Update availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/conversation/:userId` - Get conversation

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics` - Analytics data

## 🎨 UI/UX Features

- **Dark Mode**: Toggle between light and dark themes
- **Glassmorphism**: Modern glass-like styling
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion animations
- **Gradient Backgrounds**: Vibrant green and blue gradients
- **Multi-language**: English/Swahili toggle

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- CORS protection
- Helmet security headers
- File upload restrictions

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- Mobile phones
- Tablets
- Desktop computers

## 🌍 Multi-language Support

- **English**: Default language
- **Swahili**: Local language support
- Easy language switching with context

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy to platforms like:
   - Vercel
   - Netlify
   - GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: SafeHire Kenya Team
- **Contact**: info@safehirekenya.com

## 🆘 Support

For support and questions:
- Email: support@safehirekenya.com
- Phone: +254 700 000 000

---

**SafeHire Kenya** - Connecting employers with trusted workers across Kenya 🇰🇪 