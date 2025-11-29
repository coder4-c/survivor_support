import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import Support from './components/Support';
import Evidence from './components/Evidence';
import Emergency from './components/Emergency';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Preferences from './components/Preferences';
import { Chatbot } from './components/Chatbot';
import { Button } from './components/ui/button';
import { Heart, Shield } from 'lucide-react';

// Login/Signup Form Component with enhanced Salama branding
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    confirmPassword: '',
    language: 'en',
    theme: 'light'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleLanguageChange = (e) => {
    setFormData({
      ...formData,
      language: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation (Gmail only)
    if (!formData.email) {
      newErrors.email = t('email') + ' is required';
    } else if (!/^[^\s@]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid Gmail address (must end with @gmail.com)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('password') + ' is required';
    } else {
      const password = formData.password;
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/\d/.test(password)) {
        newErrors.password = 'Password must contain at least one number';
      }
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = t('name') + ' is required';
      }
      if (!formData.username) {
        newErrors.username = t('username') + ' is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await signup(
          formData.email, 
          formData.password, 
          formData.name, 
          formData.username, 
          formData.language,
          formData.theme
        );
      }

      if (!success) {
        setErrors({ submit: 'Authentication failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPreferences) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <Button
            variant="ghost"
            onClick={() => setShowPreferences(false)}
            className="text-white hover:text-purple-200"
          >
            ← Back to Salama Login
          </Button>
          <Preferences />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div>
          <div className="mx-auto h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-6">
            <Heart className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-white">
            {isLogin ? 'Welcome to Salama!' : 'Join Salama Community'}
          </h2>
          <p className="mt-2 text-center text-base sm:text-lg text-purple-100">
            {isLogin ? 'Sign in to your secure support platform' : 'Create your secure support account'}
          </p>
          <p className="mt-4 text-center text-sm text-purple-200">
            💜 Salama - Where your safety and wellbeing come first
          </p>
          <p className="mt-2 text-center text-sm text-purple-200">
            {isLogin ? "Don't have an account?" : 'Already have an account?'} 
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-white hover:text-purple-200 underline underline-offset-2"
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('name')} *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      } placeholder-gray-400`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('username')} *
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.username ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      } placeholder-gray-400`}
                      placeholder="Choose a unique username"
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('selectLanguage')} *
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleLanguageChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-gray-300"
                    >
                      <option value="en">{t('english')}</option>
                      <option value="sw">{t('swahili')}</option>
                    </select>
                  </div>
                </>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('email')} *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  } placeholder-gray-400`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('password')} *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  } placeholder-gray-400`}
                  placeholder="Enter a strong password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                {!isLogin && !errors.password && formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-600">Password requirements:</span>
                      <div className={`flex items-center space-x-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <span>8+ chars</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <span>uppercase</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/\d/.test(formData.password) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <span>number</span>
                      </div>
                    </div>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must be 8+ characters with uppercase letter and number
                </p>
              </div>
              
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('confirmPassword')} *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    } placeholder-gray-400`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600 text-center">{errors.submit}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('loading')}...
                  </div>
                ) : (
                  isLogin ? 'Sign in to Salama' : 'Join Salama Community'
                )}
              </button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowPreferences(true)}
                className="text-sm text-purple-200 hover:text-white"
              >
                ⚙️ {t('settings')}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 bg-blue-50 rounded-lg py-3 px-4 border border-blue-200">
                📝 <strong>Registration Requirements:</strong><br />
                • Email: Must be a valid Gmail address (ending with @gmail.com)<br />
                • Password: 8+ characters, 1 uppercase letter, 1 number<br />
                • Account data stored securely in database<br />
                💜 Salama ensures your privacy and security
              </p>
            </div>
          </form>
        </div>
        
        {/* Salama Security Badge */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-purple-200 text-sm">
            <Shield className="h-4 w-4" />
            <span>Secured by Salama • Your data is protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Content Component
const AppContent = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl mb-6 animate-pulse">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 text-lg font-semibold">Loading Salama...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated ? (
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="/evidence" element={
              <ProtectedRoute>
                <Evidence />
              </ProtectedRoute>
            } />
            <Route path="/emergency" element={
              <ProtectedRoute>
                <Emergency />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } />
          </Routes>
          {/* Global Chatbot - appears on all pages */}
          <Chatbot />
        </div>
      ) : (
        <AuthForm />
      )}
    </Router>
  );
};

// Main App Component with AuthProvider
const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;