import React, { createContext, useState, useContext, useEffect } from 'react';

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
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    username: 'Username',
    confirmPassword: 'Confirm Password',
    signInToAccount: 'Sign In to Your Account',
    createNewAccount: 'Create New Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signInHere: 'Sign in here',
    signUpHere: 'Sign up here',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    
    // Navigation
    dashboard: 'Dashboard',
    evidence: 'Evidence',
    support: 'Support',
    emergency: 'Emergency',
    profile: 'Profile',
    settings: 'Settings',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    yes: 'Yes',
    no: 'No',
    
    // Theme
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    toggleTheme: 'Toggle Theme',
    
    // Language
    english: 'English',
    swahili: 'Kiswahili',
    selectLanguage: 'Select Language',
    
    // User
    welcome: 'Welcome',
    myProfile: 'My Profile',
    accountSettings: 'Account Settings',
    languagePreferences: 'Language Preferences',
    themePreferences: 'Theme Preferences',
    
    // Messages
    loginSuccess: 'Login successful!',
    signupSuccess: 'Account created successfully!',
    logoutSuccess: 'Logged out successfully!',
    preferencesUpdated: 'Preferences updated successfully!',
    
    // Errors
    invalidEmail: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    nameRequired: 'Full name is required',
    usernameRequired: 'Username is required',
    loginFailed: 'Login failed. Please check your credentials.',
    signupFailed: 'Failed to create account. Please try again.',
    networkError: 'Network error. Please check your connection.',
    
    // App title
<<<<<<< HEAD
    appTitle: 'Salama',
=======
    appTitle: 'Safe Circle',
>>>>>>> 5cb7af70c22c640faf70e8226d5ccf889f3e197a
    appSubtitle: 'Community Safety Platform'
  },
  sw: {
    // Auth
    login: 'Ingia',
    signup: 'Jisajili',
    logout: 'Toka',
    email: 'Barua pepe',
    password: 'Nenosiri',
    name: 'Jina kamili',
    username: 'Jina la mtumiaji',
    confirmPassword: 'Thibitisha nenosiri',
    signInToAccount: 'Ingia kwa akaunti yako',
    createNewAccount: 'Unda akaunti mpya',
    alreadyHaveAccount: 'Je, una akaunti tayari?',
    dontHaveAccount: "Je, huna akaunti?",
    signInHere: 'Ingia hapa',
    signUpHere: 'Jisajili hapa',
    forgotPassword: 'Umesahau nenosiri?',
    rememberMe: 'Nikumbuke',
    
    // Navigation
    dashboard: 'Kibodi',
    evidence: 'Ushahidi',
    support: 'Msaada',
    emergency: 'Dharura',
    profile: 'Profaili',
    settings: 'Mipangilio',
    
    // Common
    save: 'Hifadhi',
    cancel: 'Ghairi',
    delete: 'Futa',
    edit: 'Hariri',
    submit: 'Tuma',
    loading: 'Inapakia...',
    error: 'Hitilafu',
    success: 'Mafanikio',
    yes: 'Ndiyo',
    no: 'Hapana',
    
    // Theme
    lightMode: 'Mtindo wa Mchanga',
    darkMode: 'Mtindo wa Giza',
    toggleTheme: 'Badilisha mtindo',
    
    // Language
    english: 'Kiingereza',
    swahili: 'Kiswahili',
    selectLanguage: 'Chagua lugha',
    
    // User
    welcome: 'Karibu',
    myProfile: 'Profaili yangu',
    accountSettings: 'Mipangilio ya akaunti',
    languagePreferences: 'Mapendekezo ya lugha',
    themePreferences: 'Mapendekezo ya mtindo',
    
    // Messages
    loginSuccess: 'Umeingia kwa mafanikio!',
    signupSuccess: 'Akaunti imundwa kwa mafanikio!',
    logoutSuccess: 'Umetoka kwa mafanikio!',
    preferencesUpdated: 'Mapendekezo yamesasishwa kwa mafanikio!',
    
    // Errors
    invalidEmail: 'Tafadhali ingiza barua pepe halali',
    passwordRequired: 'Nenosiri unahitajika',
    nameRequired: 'Jina kamili linahitajika',
    usernameRequired: 'Jina la mtumiaji linahitajika',
    loginFailed: 'Kuingia kumeshindwa. Tafadhali angalia kadi zako.',
    signupFailed: 'Kujenga akaunti kimeshindwa. Jaribu tena.',
    networkError: 'Hitilafu ya mtandao. Tafadhali angalia muunganisho wako.',
    
    // App title
    appTitle: 'Mzunguko Salama',
    appSubtitle: 'Jukwaa la Usalama wa Jamii'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load language from localStorage or default to 'en'
    const storedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(storedLanguage);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || translations.en[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};