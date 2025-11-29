import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge'; 
import { 
  Bell,
  Menu,
  X,
  Shield,
  Home,
  Users,
  FileText,
  AlertTriangle,
  Settings,
  LogOut
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Support', href: '/support', icon: Users },
    { name: 'Evidence', href: '/evidence', icon: FileText },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const displayName = user?.username || user?.firstName || user?.name || 'User';

  return (
    <nav className="bg-white shadow-xl border-b-2 border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-10 sm:h-12 w-10 sm:w-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 sm:h-7 w-6 sm:w-7 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Safe Circle
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-xl text-sm xl:text-base font-semibold transition-all ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User menu and notifications */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications - Hidden on mobile */}
            <Button variant="ghost" size="icon" className="relative hover:bg-purple-50 hidden sm:flex">
              <Bell className="h-5 w-5 text-purple-600" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-2 sm:space-x-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl px-2 sm:px-4 py-2">
              <div className="hidden md:block text-right">
                <div className="text-xs sm:text-sm font-bold text-gray-900">
                  Welcome, {displayName}! ✨
                </div>
                <div className="text-xs text-purple-600 truncate max-w-24">
                  {user?.email}
                </div>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-2 sm:px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-xs sm:text-sm"
              >
                <LogOut className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-purple-50"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-purple-600" />
                ) : (
                  <Menu className="h-5 w-5 text-purple-600" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-100 bg-purple-50 rounded-b-2xl">
            <div className="px-2 pt-2 pb-4 space-y-2">
              {/* Mobile user info */}
              <div className="md:hidden bg-white rounded-xl p-4 mb-4 shadow-sm">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900 mb-1">
                    Welcome, {displayName}! ✨
                  </div>
                  <div className="text-xs text-purple-600">
                    {user?.email}
                  </div>
                </div>
              </div>
              
              {/* Mobile navigation */}
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-purple-200 to-blue-200 text-purple-700'
                        : 'text-purple-600 hover:text-purple-800 hover:bg-purple-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile notifications */}
              <div className="sm:hidden flex items-center justify-between px-4 py-3 border-t border-purple-200 mt-4">
                <span className="text-purple-600 font-medium">Notifications</span>
                <Badge variant="destructive" className="bg-red-500">
                  3 new
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User info bar */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2 sm:space-x-3 text-white">
              <div className="h-2 w-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="font-semibold hidden sm:inline">
                Welcome back, {displayName}! We're here to support you. 💜
              </span>
              <span className="font-semibold sm:hidden">
                Welcome, {displayName}! 💜
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 text-purple-100">
              <Shield className="h-3 sm:h-4 w-3 sm:w-4" />
              <span className="font-medium hidden sm:inline">Secure Session Active</span>
              <span className="font-medium sm:hidden">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;