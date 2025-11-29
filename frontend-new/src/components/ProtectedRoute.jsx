import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
        <div className="text-center">
          <div className="mx-auto h-16 sm:h-20 w-16 sm:w-20 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6">
            <Shield className="h-8 sm:h-10 w-8 sm:w-10 text-purple-600 animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg font-semibold">Loading your secure session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto h-16 sm:h-20 w-16 sm:w-20 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6">
            <Shield className="h-8 sm:h-10 w-8 sm:w-10 text-purple-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Access Denied
          </h2>
          <p className="text-purple-100 text-base sm:text-lg mb-6">
            Please sign in to access this secure page.
          </p>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 sm:p-6 inline-block">
            <p className="text-white font-medium text-sm sm:text-base">
              🔒 This area requires authentication for your security
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;