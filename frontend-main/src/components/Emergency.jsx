import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Shield,
  AlertTriangle,
  Heart,
  Users,
  MessageCircle,
  Car,
  Home,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Emergency = () => {
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showSafeHouseModal, setShowSafeHouseModal] = useState(false);
  const [showLiveChatModal, setShowLiveChatModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emergencyContacts = [
    {
      title: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      description: '24/7 confidential support',
      available: '24/7',
      color: 'emergency'
    },
    {
      title: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Text-based crisis support',
      available: '24/7',
      color: 'success'
    },
    {
      title: '911 Emergency Services',
      number: '911',
      description: 'Police, fire, medical emergency',
      available: '24/7',
      color: 'emergency'
    }
  ];

  const immediateActions = [
    {
      title: 'Call Emergency Services',
      description: 'If you are in immediate danger',
      icon: Phone,
      color: 'emergency',
      action: () => handleCall('911')
    },
    {
      title: 'Safe House Placement',
      description: 'Find immediate safe housing',
      icon: Home,
      color: 'success',
      action: () => handleSafeHouse()
    },
    {
      title: 'Live Crisis Chat',
      description: 'Connect with a crisis counselor',
      icon: MessageCircle,
      color: 'primary',
      action: () => handleLiveChat()
    },
    {
      title: 'Legal Emergency',
      description: 'Urgent legal assistance',
      icon: Shield,
      color: 'secondary',
      action: () => handleLegalEmergency()
    }
  ];

  const supportResources = [
    {
      title: 'Local Police Station',
      description: 'Nearest police station',
      icon: Car,
      distance: '0.5 miles'
    },
    {
      title: 'Nearest Hospital',
      description: 'Emergency medical services',
      icon: Heart,
      distance: '1.2 miles'
    },
    {
      title: 'Safe Circle Office',
      description: 'Our local office',
      icon: Users,
      distance: '2.1 miles'
    }
  ];

  const handleCall = (number) => {
    if (confirm(`This will call ${number}. Are you sure you want to proceed?`)) {
      window.location.href = `tel:${number}`;
      toast.success(`Calling ${number}...`);
    }
  };

  const handleText = (textCommand) => {
    if (confirm(`This will open your SMS app with the message "${textCommand}". Continue?`)) {
      const encodedMessage = encodeURIComponent(textCommand);
      window.location.href = `sms:?&body=${encodedMessage}`;
      toast.success(`Opening SMS with message: ${textCommand}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Copied: ${text}`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const handleSafeHouse = () => {
    toast.success('Connecting you with safe housing resources...');
    // In a real app, this would navigate to a safe house finder
  };

  const handleLiveChat = () => {
    // Connect to Crisis Text Line for live chat support
    handleText('HOME');
    toast.success('Connecting you with Crisis Text Line...');
  };

  const handleLegalEmergency = () => {
    toast.success('Connecting you with legal emergency services...');
    // In a real app, this would connect to legal aid
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setShowLocationPrompt(false);
          toast.success('Location services enabled');
          // In a real app, this would provide location-based resources
        },
        (error) => {
          toast.error('Unable to access location. Please enable location services.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Emergency banner */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-emergency-100 dark:bg-emergency-900 rounded-full flex items-center justify-center animate-pulse">
          <AlertTriangle className="h-10 w-10 text-emergency-600 dark:text-emergency-400" />
        </div>
        <h1 className="text-4xl font-bold text-emergency-700 dark:text-emergency-300">
          Emergency Support
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          If you are in immediate danger, please call 911. For crisis support, use the resources below.
        </p>
      </div>

      {/* Emergency actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {immediateActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index} 
              className={`hover:shadow-strong transition-all cursor-pointer border-2 ${
                action.color === 'emergency' 
                  ? 'border-emergency-300 hover:border-emergency-400 hover:shadow-glow-emergency' 
                  : ''
              }`}
              onClick={action.action}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900`}>
                    <Icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                    <CardDescription className="text-base">
                      {action.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant={action.color === 'emergency' ? 'emergency' : 'default'}
                  className={`w-full ${
                    action.color === 'emergency' ? 'shadow-glow-emergency' : ''
                  }`}
                  onClick={action.action}
                >
                  {action.title === 'Live Crisis Chat' ? (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Text Now
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Get Help Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Emergency contacts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyContacts.map((contact, index) => (
            <Card key={index} className="hover:shadow-strong transition-shadow">
              <CardHeader className="text-center">
                <div className={`mx-auto p-3 rounded-full bg-${
                  contact.color === 'emergency' ? 'emergency' : contact.color
                }-100 dark:bg-${contact.color}-900`}>
                  <Phone className={`h-6 w-6 text-${
                    contact.color === 'emergency' ? 'emergency' : contact.color
                  }-600 dark:text-${contact.color}-400`} />
                </div>
                <CardTitle className="text-lg">{contact.title}</CardTitle>
                <CardDescription>{contact.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {contact.number}
                  </p>
                  <div className="flex items-center justify-center mt-2">
                    <Clock className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Available {contact.available}
                    </span>
                  </div>
                </div>
                {contact.title === 'Crisis Text Line' ? (
                  <Button 
                    variant={contact.color === 'emergency' ? 'emergency' : 'default'}
                    className="w-full"
                    onClick={() => handleText('HOME')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Text Now
                  </Button>
                ) : (
                  <Button 
                    variant={contact.color === 'emergency' ? 'emergency' : 'default'}
                    className="w-full"
                    onClick={() => handleCall(contact.number.replace(/\D/g, ''))}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Location services */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Enable Location Services
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Get personalized emergency resources based on your location
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowLocationPrompt(true)}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Local resources */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Local Emergency Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card key={index} className="hover:shadow-soft transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-primary-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{resource.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {resource.description}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        <Zap className="h-3 w-3 mr-1" />
                        {resource.distance}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Safety reminder */}
      <Card className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                Your Safety is Our Priority
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                This is a secure platform. If you're using a shared device, remember to:
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 list-disc list-inside space-y-1">
                <li>Clear your browser history after use</li>
                <li>Use a private browsing window when possible</li>
                <li>Never share your login credentials</li>
                <li>Consider using a VPN for additional privacy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location prompt modal */}
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Enable Location Services</CardTitle>
              <CardDescription>
                Allow access to your location to provide personalized emergency resources?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your location will only be used to find nearby emergency services and will not be stored or shared.
              </p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowLocationPrompt(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleGetLocation}
                >
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Emergency;