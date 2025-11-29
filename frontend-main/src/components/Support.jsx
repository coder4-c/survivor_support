import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Users, 
  MessageCircle, 
  Phone, 
  Calendar,
  Clock,
  CheckCircle,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportTypes = [
    { id: 'counseling', label: 'Counseling Support', icon: Users },
    { id: 'legal', label: 'Legal Assistance', icon: MessageCircle },
    { id: 'housing', label: 'Safe Housing', icon: Calendar },
    { id: 'financial', label: 'Financial Aid', icon: Phone },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSupportTypeClick = (supportType) => {
    setFormData({
      ...formData,
      type: supportType
    });
    // Scroll to form
    document.getElementById('support-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
    toast.success(`${supportTypes.find(t => t.id === supportType)?.label} selected!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Support request submitted successfully!');
      setFormData({ name: '', email: '', type: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">Get Support</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Our dedicated team is here to help. Submit a support request or reach out directly.
        </p>
      </div>

      {/* Support options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.id} className="hover:shadow-strong transition-all cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-primary-100 dark:bg-primary-900 rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                  <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <CardTitle className="text-lg">{type.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>Available for all users</CardDescription>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full group-hover:bg-primary-50 group-hover:text-primary-600"
                  onClick={() => handleSupportTypeClick(type.id)}
                >
                  Request Support
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Support form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card id="support-form">
          <CardHeader>
            <CardTitle>Submit Support Request</CardTitle>
            <CardDescription>
              Fill out the form below and our team will get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name (Optional)
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email (Optional)
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2">
                  Support Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select support type</option>
                  <option value="counseling">Counseling Support</option>
                  <option value="legal">Legal Assistance</option>
                  <option value="housing">Safe Housing</option>
                  <option value="financial">Financial Aid</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe how we can help you..."
                  rows={4}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Direct Contact</CardTitle>
              <CardDescription>
                Need immediate assistance? Reach out directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium">24/7 Crisis Hotline</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    1-800-SAFE-CIRCLE
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Available 9 AM - 6 PM EST
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium">Schedule Appointment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Book a one-on-one session
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                    Your Privacy is Protected
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    All communications are confidential and secure. We will never share your information without your consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;