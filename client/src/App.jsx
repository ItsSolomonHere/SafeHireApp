import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import BookingsPage from './pages/BookingsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <LoginPage />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/" replace /> : <RegisterPage />
          } />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/worker/:id" element={<WorkerProfilePage />} />
          
          {/* Protected Routes */}
          <Route path="/bookings" element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  {t('error')}: Page not found
                </p>
                <a
                  href="/"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('back')} {t('home')}
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App; 