import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Star, 
  Shield, 
  Clock, 
  MapPin,
  Wrench,
  Home,
  Truck,
  Palette,
  Users,
  Shield as Security,
  BookOpen,
  Package,
  Car
} from 'lucide-react';

const HomePage = () => {
  const { t } = useLanguage();

  const categories = [
    { 
      name: t('fundi'), 
      icon: Wrench, 
      description: 'Carpenters, electricians, plumbers, masons',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: t('domestic'), 
      icon: Home, 
      description: 'Nannies, cooks, cleaners',
      color: 'from-green-500 to-green-600'
    },
    { 
      name: t('boda'), 
      icon: Truck, 
      description: 'Boda boda riders for delivery',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      name: t('gardener'), 
      icon: Home, 
      description: 'Garden maintenance and landscaping',
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      name: t('painter'), 
      icon: Palette, 
      description: 'House painting and decoration',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      name: t('eventCrew'), 
      icon: Users, 
      description: 'Event setup, ushers, DJs',
      color: 'from-pink-500 to-pink-600'
    },
    { 
      name: t('security'), 
      icon: Security, 
      description: 'Security guards and watchmen',
      color: 'from-red-500 to-red-600'
    },
    { 
      name: t('tutor'), 
      icon: BookOpen, 
      description: 'Private tutors and teachers',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      name: t('delivery'), 
      icon: Package, 
      description: 'Delivery personnel',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      name: t('driver'), 
      icon: Car, 
      description: 'Professional drivers',
      color: 'from-teal-500 to-teal-600'
    },
  ];

  const steps = [
    {
      icon: Search,
      title: t('step1'),
      description: 'Find workers in your area with our advanced search'
    },
    {
      icon: Star,
      title: t('step2'),
      description: 'Compare rates, reviews, and ratings'
    },
    {
      icon: Shield,
      title: t('step3'),
      description: 'Book and pay securely through our platform'
    },
    {
      icon: Clock,
      title: t('step4'),
      description: 'Get your job done efficiently and on time'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-slide-up">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>{t('searchWorkers')}</span>
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                {t('register')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('popularCategories')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find workers in various categories across Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('howItWorks')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Simple steps to get your job done
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform translate-x-4"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Verified Workers
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All workers are verified and background-checked for your safety
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Quick Service
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find and book workers within minutes, not days
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Local Workers
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with workers in your local area
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of employers and workers using SafeHire Kenya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t('register')} Now
            </Link>
            <Link
              to="/search"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              {t('searchWorkers')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 