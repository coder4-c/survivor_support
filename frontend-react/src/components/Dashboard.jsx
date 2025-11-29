import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
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
  const { user } = useUser();
  const [stats, setStats] = useState({
    supportRequests: 0,
    evidenceFiles: 0,
    activeChats: 0,
    pendingAppointments: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        supportRequests: 5,
        evidenceFiles: 12,
        activeChats: 2,
        pendingAppointments: 1
      });
    }, 1000);

    // Load recent activity
    setRecentActivity([
      {
        id: 1,
        type: 'support',
        title: 'New support request received',
        description: 'A new support request has been submitted and is awaiting review.',
        time: '2 hours ago',
        status: 'pending'
      },
      {
        id: 2,
        type: 'evidence',
        title: 'Evidence file uploaded',
        description: '3 files have been securely uploaded to your evidence vault.',
        time: '4 hours ago',
        status: 'completed'
      },
      {
        id: 3,
        type: 'chat',
        title: 'Support chat started',
        description: 'You have a new support chat session waiting.',
        time: '1 hour ago',
        status: 'active'
      }
    ]);
  }, []);

  const statCards = [
    {
      title: 'Support Requests',
      value: stats.supportRequests,
      description: 'Active requests',
      icon: Users,
      color: 'primary',
      link: '/support'
    },
    {
      title: 'Evidence Files',
      value: stats.evidenceFiles,
      description: 'Secure files',
      icon: FileText,
      color: 'secondary',
      link: '/evidence'
    },
    {
      title: 'Active Chats',
      value: stats.activeChats,
      description: 'Ongoing support',
      icon: MessageCircle,
      color: 'success',
      link: '/support'
    },
    {
      title: 'Appointments',
      value: stats.pendingAppointments,
      description: 'Pending sessions',
      icon: Calendar,
      color: 'emergency',
      link: '/support'
    }
  ];

  const quickActions = [
    {
      title: 'Submit Support Request',
      description: 'Get help from our support team',
      icon: Users,
      color: 'primary',
      link: '/support'
    },
    {
      title: 'Upload Evidence',
      description: 'Securely store important files',
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

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your secure support platform is ready. Access your resources, upload evidence, 
          or get help from our dedicated support team.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-strong transition-shadow cursor-pointer">
              <Link to={stat.link}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 text-success-500 mr-1" />
                    <span className="text-xs text-success-500">+12% from last week</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-strong transition-all cursor-pointer group">
                <Link to={action.link}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900`}>
                        <Icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                    <Button variant="ghost" className="mt-4 w-full group-hover:bg-primary-50 group-hover:text-primary-600">
                      Get Started →
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <Card key={activity.id} className="hover:shadow-soft transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'support' ? 'bg-blue-100 dark:bg-blue-900' :
                      activity.type === 'evidence' ? 'bg-green-100 dark:bg-green-900' :
                      'bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      {activity.type === 'support' && <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                      {activity.type === 'evidence' && <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />}
                      {activity.type === 'chat' && <MessageCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        activity.status === 'completed' ? 'success' :
                        activity.status === 'active' ? 'default' :
                        'secondary'
                      }
                    >
                      {activity.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {activity.status === 'active' && <Clock className="h-3 w-3 mr-1" />}
                      {activity.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency contact banner */}
      <Card className="bg-emergency-50 border-emergency-200 dark:bg-emergency-900 dark:border-emergency-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emergency-100 dark:bg-emergency-800 rounded-full">
                <Phone className="h-6 w-6 text-emergency-600 dark:text-emergency-400" />
              </div>
              <div>
                <h3 className="font-semibold text-emergency-800 dark:text-emergency-200">
                  Need Immediate Help?
                </h3>
                <p className="text-sm text-emergency-700 dark:text-emergency-300">
                  Our crisis support team is available 24/7
                </p>
              </div>
            </div>
            <Link to="/emergency">
              <Button variant="emergency" className="shadow-glow-emergency">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;