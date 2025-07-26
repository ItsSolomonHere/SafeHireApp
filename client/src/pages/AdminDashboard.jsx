import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page will display admin analytics, user management, and system statistics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 