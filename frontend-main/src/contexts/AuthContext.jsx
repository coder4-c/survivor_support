import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user data
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Only validate token if we have a valid user, skip if user data is missing or invalid
        if (userData && userData.id) {
          // validateToken(token); // Disabled for now due to database connection issues
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data.error || 'Login failed. Please try again.');
        }
      }

      // Validate response data
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server. Please try again.');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      console.log('Login successful for user:', data.user.email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more user-friendly error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  };

  const signup = async (email, password, name, username, language = 'en', theme = 'light') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, username, language, theme })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          if (data.error.includes('email') && data.error.includes('already exists')) {
            throw new Error('An account with this email already exists. Please use a different email or try logging in.');
          } else if (data.error.includes('username') && data.error.includes('already taken')) {
            throw new Error('This username is already taken. Please choose a different username.');
          } else {
            throw new Error(data.error || 'Please check your information and try again.');
          }
        } else if (response.status >= 500) {
          throw new Error('Server error during registration. Please try again later.');
        } else {
          throw new Error(data.error || 'Registration failed. Please try again.');
        }
      }

      // Validate response data
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server. Please try again.');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      console.log('Registration successful for user:', data.user.email);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      
      // Provide more user-friendly error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update preferences');
      }

      // Update user data in state and localStorage
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return true;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updatePreferences,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};