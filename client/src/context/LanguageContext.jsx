import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    bookings: 'Bookings',
    messages: 'Messages',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    location: 'Location',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    
    // Worker Categories
    fundi: 'Fundi',
    domestic: 'Domestic Worker',
    boda: 'Boda Boda Rider',
    gardener: 'Gardener',
    painter: 'Painter',
    eventCrew: 'Event Crew',
    security: 'Security Guard',
    tutor: 'Tutor',
    delivery: 'Delivery Personnel',
    driver: 'Driver',
    
    // Booking
    bookNow: 'Book Now',
    scheduleJob: 'Schedule Job',
    jobTitle: 'Job Title',
    description: 'Description',
    scheduledDate: 'Scheduled Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    duration: 'Duration (hours)',
    specialRequirements: 'Special Requirements',
    totalAmount: 'Total Amount',
    status: 'Status',
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Worker Profile
    skills: 'Skills',
    bio: 'Bio',
    hourlyRate: 'Hourly Rate',
    dailyRate: 'Daily Rate',
    availability: 'Availability',
    available: 'Available',
    busy: 'Busy',
    unavailable: 'Unavailable',
    rating: 'Rating',
    reviews: 'Reviews',
    experience: 'Experience',
    verified: 'Verified',
    backgroundCheck: 'Background Check',
    
    // Messages
    sendMessage: 'Send Message',
    typeMessage: 'Type your message...',
    noMessages: 'No messages yet',
    conversations: 'Conversations',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    clear: 'Clear',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    
    // Homepage
    heroTitle: 'Connect with Trusted Workers',
    heroSubtitle: 'Find reliable blue-collar service providers in Kenya',
    searchWorkers: 'Search Workers',
    popularCategories: 'Popular Categories',
    howItWorks: 'How It Works',
    step1: 'Search for workers in your area',
    step2: 'Compare rates and reviews',
    step3: 'Book and pay securely',
    step4: 'Get the job done',
    
    // Footer
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: '© 2024 SafeHire Kenya. All rights reserved.',
  },
  sw: {
    // Navigation
    home: 'Nyumbani',
    search: 'Tafuta',
    bookings: 'Orodha',
    messages: 'Ujumbe',
    profile: 'Wasifu',
    login: 'Ingia',
    register: 'Jisajili',
    logout: 'Ondoka',
    
    // Auth
    email: 'Barua pepe',
    password: 'Nywila',
    name: 'Jina',
    phone: 'Simu',
    location: 'Mahali',
    confirmPassword: 'Thibitisha Nywila',
    forgotPassword: 'Umesahau nywila?',
    dontHaveAccount: 'Huna akaunti?',
    alreadyHaveAccount: 'Una akaunti?',
    signUp: 'Jisajili',
    signIn: 'Ingia',
    
    // Worker Categories
    fundi: 'Fundi',
    domestic: 'Mfanyakazi wa Nyumbani',
    boda: 'Mpanda Boda Boda',
    gardener: 'Mkulima wa Bustani',
    painter: 'Mchoraji',
    eventCrew: 'Wafanyakazi wa Matukio',
    security: 'Mlinzi wa Usalama',
    tutor: 'Mwalimu',
    delivery: 'Mtoaji Huduma',
    driver: 'Dereva',
    
    // Booking
    bookNow: 'Oda Sasa',
    scheduleJob: 'Panga Kazi',
    jobTitle: 'Jina la Kazi',
    description: 'Maelezo',
    scheduledDate: 'Tarehe ya Kupangwa',
    startTime: 'Muda wa Kuanza',
    endTime: 'Muda wa Kumaliza',
    duration: 'Muda (masaa)',
    specialRequirements: 'Mahitaji Maalum',
    totalAmount: 'Jumla ya Malipo',
    status: 'Hali',
    pending: 'Inasubiri',
    accepted: 'Imekubaliwa',
    rejected: 'Imekataliwa',
    completed: 'Imekamilika',
    cancelled: 'Imesitishwa',
    
    // Worker Profile
    skills: 'Ujuzi',
    bio: 'Wasifu',
    hourlyRate: 'Kiwango cha Saa',
    dailyRate: 'Kiwango cha Siku',
    availability: 'Upatikanaji',
    available: 'Inapatikana',
    busy: 'Iko Kazini',
    unavailable: 'Haipatikani',
    rating: 'Ukadiriaji',
    reviews: 'Maoni',
    experience: 'Uzoefu',
    verified: 'Imethibitishwa',
    backgroundCheck: 'Uchunguzi wa Nyuma',
    
    // Messages
    sendMessage: 'Tuma Ujumbe',
    typeMessage: 'Andika ujumbe wako...',
    noMessages: 'Hakuna ujumbe bado',
    conversations: 'Mazungumzo',
    
    // Common
    search: 'Tafuta',
    filter: 'Chuja',
    sort: 'Panga',
    clear: 'Futa',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    edit: 'Hariri',
    delete: 'Futa',
    view: 'Tazama',
    back: 'Rudi',
    next: 'Ifuatayo',
    previous: 'Iliyotangulia',
    loading: 'Inapakia...',
    error: 'Hitilafu',
    success: 'Mafanikio',
    warning: 'Onyo',
    info: 'Maelezo',
    
    // Homepage
    heroTitle: 'Unganisha na Wafanyakazi Waaminifu',
    heroSubtitle: 'Pata watoa huduma waaminifu nchini Kenya',
    searchWorkers: 'Tafuta Wafanyakazi',
    popularCategories: 'Jamii Maarufu',
    howItWorks: 'Jinsi Inavyofanya Kazi',
    step1: 'Tafuta wafanyakazi katika eneo lako',
    step2: 'Linganisha bei na maoni',
    step3: 'Oda na ulipe kwa usalama',
    step4: 'Pata kazi ikamilike',
    
    // Footer
    about: 'Kuhusu',
    contact: 'Wasiliana',
    privacy: 'Sera ya Faragha',
    terms: 'Sheria za Huduma',
    copyright: '© 2024 SafeHire Kenya. Haki zote zimehifadhiwa.',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'sw' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 