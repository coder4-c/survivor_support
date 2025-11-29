import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

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
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Demo login - check if user has signed up before
      const storedUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const existingUser = storedUsers.find(user => user.email === email);
      
      if (!existingUser) {
        throw new Error('Account not found. Please sign up first.');
      }
      
      if (existingUser.password !== password) {
        throw new Error('Invalid password. Please try again.');
      }
      
      // Login successful
      const { password: _, ...userData } = existingUser;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to be caught by the form handler
    }
  };

  const signup = async (email, password, name, username) => {
    try {
      // Demo signup - in real app, this would call your API
      if (email && password && name && username) {
        // Check if user already exists
        const storedUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
        const existingUser = storedUsers.find(user => user.email === email);
        
        if (existingUser) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        
        const userData = {
          id: Date.now(),
          email: email,
          name: name,
          username: username,
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
          password: password, // In real app, this would be hashed
          createdAt: new Date().toISOString(),
          hasReportedCases: false
        };
        
        // Store in demo users list
        storedUsers.push(userData);
        localStorage.setItem('demoUsers', JSON.stringify(storedUsers));
        
        // Auto login after signup
        const { password: _, ...loginData } = userData;
        setUser(loginData);
        localStorage.setItem('user', JSON.stringify(loginData));
        return true;
      }
      throw new Error('All fields are required.');
    } catch (error) {
      console.error('Signup error:', error);
      throw error; // Re-throw to be caught by the form handler
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};