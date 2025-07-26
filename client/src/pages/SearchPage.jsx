import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage = () => {
  const { t } = useLanguage();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    availability: '',
    minRate: '',
    maxRate: '',
    skills: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'fundi', label: t('fundi') },
    { value: 'domestic', label: t('domestic') },
    { value: 'boda', label: t('boda') },
    { value: 'gardener', label: t('gardener') },
    { value: 'painter', label: t('painter') },
    { value: 'event-crew', label: t('eventCrew') },
    { value: 'security', label: t('security') },
    { value: 'tutor', label: t('tutor') },
    { value: 'delivery', label: t('delivery') },
    { value: 'driver', label: t('driver') },
  ];

  const availabilityOptions = [
    { value: 'available', label: t('available') },
    { value: 'busy', label: t('busy') },
  ];

  const searchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/workers/search?${params}`);
      setWorkers(response.data.workers);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchWorkers();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchWorkers();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      availability: '',
      minRate: '',
      maxRate: '',
      skills: '',
    });
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'busy':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('searchWorkers')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find trusted workers in your area
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Availability</option>
                {availabilityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>{t('search')}</span>
              </button>
            </div>

            {/* Advanced Filters */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <Filter className="w-5 h-5" />
                <span>Advanced Filters</span>
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              >
                {t('clear')}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Rate (KSH/hour)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minRate}
                    onChange={(e) => handleFilterChange('minRate', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Rate (KSH/hour)
                  </label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={filters.maxRate}
                    onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., plumbing, electrical"
                    value={filters.skills}
                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : workers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <div
                  key={worker._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {worker.userId?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {worker.userId?.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {categories.find(c => c.value === worker.category)?.label}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(worker.availability)}`}>
                        {worker.availability}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {worker.bio}
                      </p>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {worker.userId?.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {worker.rating.toFixed(1)} ({worker.totalReviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            KSH {worker.hourlyRate}/hour
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            {worker.experience} years
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {worker.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {worker.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                            +{worker.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                        {t('bookNow')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No workers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 