import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple components using standard Tailwind colors
const SimpleDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Salama Dashboard</h1>
        <p className="text-gray-600">Welcome to your secure support platform!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Support Requests</h3>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Evidence Files</h3>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Chats</h3>
          <p className="text-3xl font-bold text-red-600">2</p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Support</h3>
          <p className="text-red-700 mb-4">If you are in immediate danger, call 911</p>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Emergency Help
          </button>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <SignedIn>
            <SimpleDashboard />
          </SignedIn>

          <SignedOut>
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-blue-600 mb-2">
                    Salama
                  </h1>
                  <p className="text-gray-600">
                    Secure support platform for survivors
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <SignIn 
                    routing="path" 
                    path="/sign-in"
                    appearance={{
                      elements: {
                        rootBox: "mx-auto",
                        card: "shadow-none border-0",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </SignedOut>
        </div>
      </Router>
    </ClerkProvider>
  );
};

export default App;