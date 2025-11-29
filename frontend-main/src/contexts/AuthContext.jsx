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
    // Check for stored token and validate with backend
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Validate token with backend
        validateToken(token);
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
      
      // Demo mode: If it's a demo token, keep the user logged in
      if (token === 'demo-token') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            return; // Keep user logged in
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }
      
      // For real tokens or failed demo mode, clear storage
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
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Demo mode: Allow login without backend
      if (email && password) {
        const demoUser = {
          id: 'demo-user',
          email: email,
          name: 'Demo User',
          username: email.split('@')[0],
          language: 'en',
          theme: 'light'
        };
        
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify(demoUser));
        setUser(demoUser);
        
        return true;
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
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      
      // Demo mode: Allow signup without backend
      if (email && password) {
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          email: email,
          name: name || email.split('@')[0],
          username: username || email.split('@')[0],
          language: language || 'en',
          theme: theme || 'light'
        };
        
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify(demoUser));
        setUser(demoUser);
        
        return true;
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
      
      // Demo mode: Update preferences locally without backend
      const currentUser = localStorage.getItem('user');
      if (currentUser && token === 'demo-token') {
        try {
          const userData = JSON.parse(currentUser);
          const updatedUser = { ...userData, ...preferences };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return true;
        } catch (e) {
          console.error('Error updating demo user preferences:', e);
        }
      }
      
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