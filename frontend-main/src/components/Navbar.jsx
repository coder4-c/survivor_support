import React, { useState, useRef, useEffect } from 'react';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  // Initialize notifications with welcome message for new users
  useEffect(() => {
    if (user) {
      const userCreatedAt = new Date(user.createdAt);
      const now = new Date();
      const daysSinceJoined = (now - userCreatedAt) / (1000 * 60 * 60 * 24);
      const hoursSinceJoined = (now - userCreatedAt) / (1000 * 60 * 60);

      let initialNotifications = [];

      if (hoursSinceJoined < 2) {
        // Very new user - immediate welcome
        initialNotifications = [
          {
            id: 'welcome',
            title: 'Welcome to Salama! 💜',
            message: `Dear ${user.username}, we're so honored that you've chosen to trust us with your journey. You're not alone - we're here to support you every step of the way.`,
            time: 'Just now',
            unread: true,
            type: 'welcome'
          },
          {
            id: 'getting-started',
            title: 'Getting Started Guide',
            message: 'Take a moment to explore your dashboard. You can upload evidence, request support, or reach out for immediate help anytime.',
            time: '5 minutes ago',
            unread: true,
            type: 'resource'
          }
        ];
      } else if (daysSinceJoined < 1) {
        // New user (within 24 hours)
        initialNotifications = [
          {
            id: 'check-in-1',
            title: 'How are you settling in?',
            message: 'We hope you\'re feeling a bit more supported already. Remember, reaching out for help is a sign of strength, not weakness.',
            time: '6 hours ago',
            unread: Math.random() > 0.3,
            type: 'community'
          },
          {
            id: 'resources',
            title: 'Helpful Resources Ready',
            message: 'Your personal resource library is ready with guides tailored to your needs. Start with the "First Steps" collection.',
            time: '12 hours ago',
            unread: Math.random() > 0.5,
            type: 'resource'
          }
        ];
      } else if (daysSinceJoined < 3) {
        // Short-term user (1-3 days)
        initialNotifications = [
          {
            id: 'progress',
            title: 'Your Progress Matters',
            message: 'Every small step forward is significant. We\'re proud of you for taking this journey. Consider joining our community check-in tonight.',
            time: '1 day ago',
            unread: Math.random() > 0.4,
            type: 'community'
          },
          {
            id: 'support-available',
            title: 'Professional Support Available',
            message: 'If you haven\'t already, our licensed counselors are here 24/7. No appointment needed for crisis support.',
            time: '2 days ago',
            unread: Math.random() > 0.6,
            type: 'support'
          }
        ];
      } else if (daysSinceJoined < 7) {
        // First week user
        initialNotifications = [
          {
            id: 'week-check',
            title: 'One Week Milestone',
            message: 'It\'s been a week since you joined our community. How are you feeling? Our team would love to hear from you.',
            time: '3 days ago',
            unread: Math.random() > 0.5,
            type: 'community'
          },
          {
            id: 'appointment-suggestion',
            title: 'Schedule Your First Session',
            message: 'Ready to speak with a professional? Book your first counseling session. Many find it helpful to have a regular check-in.',
            time: '5 days ago',
            unread: Math.random() > 0.6,
            type: 'appointment'
          }
        ];
      } else {
        // Returning user - show realistic notifications
        initialNotifications = [
          {
            id: 1,
            title: 'Support Request Update',
            message: `Your counseling support request has been assigned to Dr. Sarah Martinez. She specializes in trauma support and will reach out within 24 hours.`,
            time: '3 hours ago',
            unread: Math.random() > 0.5,
            type: 'support'
          },
          {
            id: 2,
            title: 'New Safety Resources Available',
            message: 'We\'ve added new self-care guides and emergency contact templates to your resource library.',
            time: '1 day ago',
            unread: Math.random() > 0.5,
            type: 'resource'
          },
          {
            id: 3,
            title: 'Upcoming Session Reminder',
            message: 'You have a scheduled support session with your counselor tomorrow at 2:00 PM. We\'ve sent preparation materials to your email.',
            time: '2 days ago',
            unread: Math.random() > 0.5,
            type: 'appointment'
          },
          {
            id: 4,
            title: 'Community Check-in',
            message: 'How are you feeling today? Our peer support group is meeting tonight at 7 PM. You\'re always welcome to join.',
            time: '3 days ago',
            unread: Math.random() > 0.5,
            type: 'community'
          }
        ];
      }

      setNotifications(initialNotifications);
    }
  }, [user]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
    setShowNotifications(false);
    // In a real app, you'd also update this on the backend
  };

  // Mark single notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome': return '💜';
      case 'support': return '🤝';
      case 'resource': return '📚';
      case 'appointment': return '📅';
      case 'community': return '👥';
      default: return '🔔';
    }
  };

  // Get notification styling based on type
  const getNotificationStyling = (type) => {
    switch (type) {
      case 'welcome':
        return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200';
      case 'support':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
      case 'resource':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'appointment':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      case 'community':
        return 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

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
                Salama
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
            <div className="relative hidden sm:block" ref={notificationRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-purple-50"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-purple-600" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  {notifications.filter(n => n.unread).length}
                </Badge>
              </Button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                        <p className="text-sm text-gray-600">
                          {notifications.filter(n => n.unread).length > 0 
                            ? `${notifications.filter(n => n.unread).length} unread message${notifications.filter(n => n.unread).length !== 1 ? 's' : ''}`
                            : 'All caught up!'
                          }
                        </p>
                      </div>
                      {notifications.filter(n => n.unread).length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 font-medium"
                          onClick={markAllAsRead}
                        >
                          ✓ Mark all read
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-3">🔔</div>
                        <p className="text-gray-500">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${
                            getNotificationStyling(notification.type)
                          } ${notification.unread ? 'ring-l-2 ring-purple-300' : ''}`}
                          onClick={() => {
                            markAsRead(notification.id);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-bold text-gray-900">
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-gray-500 font-medium">
                                  {notification.time}
                                </p>
                                {notification.unread && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <p className="text-xs text-gray-500 text-center">
                        💜 Salama - Supporting your journey with care
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

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