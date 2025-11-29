import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  FileText, 
  Shield, 
  Phone,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    supportRequests: 0,
    evidenceFiles: 0,
    activeChats: 0,
    pendingAppointments: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading real user data
    setTimeout(() => {
      // Check if this is a new user (no cases reported yet)
      const isNewUser = !user?.hasReportedCases;
      
      if (isNewUser) {
        setStats({
          supportRequests: 0,
          evidenceFiles: 0,
          activeChats: 0,
          pendingAppointments: 0
        });
        setRecentActivity([]);
      } else {
        // Load actual case data if user has reported cases
        setStats({
          supportRequests: user?.supportRequests || 0,
          evidenceFiles: user?.evidenceFiles || 0,
          activeChats: user?.activeChats || 0,
          pendingAppointments: user?.pendingAppointments || 0
        });
        
        // Load user's actual activity
        const userActivity = user?.recentActivity || [];
        setRecentActivity(userActivity.length > 0 ? userActivity : []);
      }
      setLoading(false);
    }, 800);
  }, [user]);

  const displayName = user?.username || user?.firstName || user?.name || 'User';

  const statCards = [
    {
      title: 'Support Requests',
      value: stats.supportRequests,
      description: stats.supportRequests === 0 ? 'No cases reported yet' : 'Active requests',
      icon: Users,
      color: 'primary',
      link: '/support'
    },
    {
      title: 'Evidence Files',
      value: stats.evidenceFiles,
      description: stats.evidenceFiles === 0 ? 'No files uploaded' : 'Secure files',
      icon: FileText,
      color: 'secondary',
      link: '/evidence'
    },
    {
      title: 'Active Chats',
      value: stats.activeChats,
      description: stats.activeChats === 0 ? 'No active chats' : 'Ongoing support',
      icon: MessageCircle,
      color: 'success',
      link: '/support'
    },
    {
      title: 'Appointments',
      value: stats.pendingAppointments,
      description: stats.pendingAppointments === 0 ? 'No appointments' : 'Pending sessions',
      icon: Calendar,
      color: 'emergency',
      link: '/support'
    }
  ];

  const quickActions = [
    {
      title: 'Submit Support Request',
      description: stats.supportRequests === 0 ? 'Report your first case' : 'Get help from our support team',
      icon: Users,
      color: 'primary',
      link: '/support'
    },
    {
      title: 'Upload Evidence',
      description: stats.evidenceFiles === 0 ? 'Upload your first file' : 'Securely store important files',
      icon: Shield,
      color: 'secondary',
      link: '/evidence'
    },
    {
      title: 'Emergency Help',
      description: 'Immediate crisis support',
      icon: Phone,
      color: 'emergency',
      link: '/emergency'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl mb-6 animate-pulse">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 text-lg font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isNewUser = stats.supportRequests === 0 && stats.evidenceFiles === 0 && recentActivity.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Welcome section */}
      <div className="text-center space-y-4 sm:space-y-6 pt-8 sm:pt-12 pb-6 sm:pb-8 px-4">
        <div className="mx-auto h-16 sm:h-20 w-16 sm:w-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
          <Shield className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back, {displayName}! 👋
          </h1>
          {isNewUser ? (
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
<<<<<<< HEAD
              👋 We're so happy to have you join Salama! This is your secure support platform. 
=======
              👋 We're so happy to have you join Safe Circle! This is your secure support platform. 
>>>>>>> 5cb7af70c22c640faf70e8226d5ccf889f3e197a
              Start by reporting your first case or getting the help you need.
            </p>
          ) : (
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              We're so happy to see you again! Your secure support platform is ready with all your personalized resources.
            </p>
          )}
          <div className="mt-4 inline-flex items-center px-3 sm:px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium">
            <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-2" />
            You are securely logged in
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white border-0 shadow-lg">
                <Link to={stat.link}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                      <Icon className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">{stat.description}</p>
                    {stat.value > 0 && (
                      <div className="flex items-center">
                        <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium">Active</span>
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colors = [
                'from-purple-500 to-purple-600',
                'from-blue-500 to-blue-600', 
                'from-red-500 to-red-600'
              ];
              const bgColors = [
                'from-purple-50 to-purple-100',
                'from-blue-50 to-blue-100',
                'from-red-50 to-red-100'
              ];
              return (
                <Card key={index} className="hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:scale-105 bg-white border-0 shadow-lg">
                  <Link to={action.link}>
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${bgColors[index]} shadow-lg`}>
                        <Icon className={`h-6 sm:h-8 w-6 sm:w-8 bg-gradient-to-r ${colors[index]} bg-clip-text text-transparent`} />
                      </div>
                      <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {action.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{action.description}</CardDescription>
                      <div className={`w-full py-2 sm:py-3 px-4 bg-gradient-to-r ${colors[index]} text-white rounded-xl font-semibold text-sm sm:text-base group-hover:shadow-lg transition-all transform group-hover:scale-105`}>
                        Get Started →
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity or welcome message for new users */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recent Activity</h2>
            {!isNewUser && (
              <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50 text-sm">
                View All
              </Button>
            )}
          </div>
          
          {isNewUser ? (
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
<<<<<<< HEAD
                  👋 Welcome to Salama, {displayName}!
=======
                  👋 Welcome to Safe Circle, {displayName}!
>>>>>>> 5cb7af70c22c640faf70e8226d5ccf889f3e197a
                </h3>
                <p className="text-gray-600 mb-6 text-base sm:text-lg">
                  You haven't reported any cases yet. Our platform is here to help you when you need it. 
                  You can start by:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-2">Submit a Case</h4>
                    <p className="text-sm text-gray-600">Report your situation to get support</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-2">Upload Evidence</h4>
                    <p className="text-sm text-gray-600">Securely store important files</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : recentActivity.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  All caught up!
                </h3>
                <p className="text-gray-600">
                  No recent activity. Your cases are being processed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const colors = {
                  support: 'bg-blue-100 text-blue-600',
                  evidence: 'bg-green-100 text-green-600',
                  chat: 'bg-yellow-100 text-yellow-600'
                };
                return (
                  <Card key={activity.id} className="hover:shadow-lg transition-all duration-300 bg-white border-0 shadow-md">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start sm:items-center justify-between">
                        <div className="flex items-start sm:items-center space-x-4">
                          <div className={`p-2 sm:p-3 rounded-full ${colors[activity.type]} flex-shrink-0`}>
                            {activity.type === 'support' && <Users className="h-4 sm:h-5 w-4 sm:w-5" />}
                            {activity.type === 'evidence' && <FileText className="h-4 sm:h-5 w-4 sm:w-5" />}
                            {activity.type === 'chat' && <MessageCircle className="h-4 sm:h-5 w-4 sm:w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-lg">{activity.title}</h4>
                            <p className="text-gray-600 text-sm sm:text-base">{activity.description}</p>
                          </div>
                        </div>
                        <div className="text-right mt-2 sm:mt-0 flex-shrink-0">
                          <Badge 
                            variant={
                              activity.status === 'completed' ? 'default' :
                              activity.status === 'active' ? 'default' :
                              'secondary'
                            }
                            className={`mb-2 text-xs ${
                              activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                              activity.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {activity.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {activity.status === 'active' && <Clock className="h-3 w-3 mr-1" />}
                            {activity.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {activity.status}
                          </Badge>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Emergency contact banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4 text-center sm:text-left">
                <div className="p-3 bg-white bg-opacity-20 rounded-full flex-shrink-0">
                  <Phone className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl sm:text-2xl">
                    Need Immediate Help?
                  </h3>
                  <p className="text-red-100 text-base sm:text-lg">
                    Our crisis support team is available 24/7 for immediate assistance
                  </p>
                </div>
              </div>
              <Link to="/emergency" className="flex-shrink-0">
                <Button className="bg-white text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;