const express = require('express');
const axios = require('axios');
const router = express.Router();

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  const { message, context = [] } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Try immediate local response first for faster response time
  const quickResponse = getQuickResponse(message.toLowerCase());
  if (quickResponse) {
    console.log('Using quick local response');
    return res.json({ response: quickResponse });
  }

  // Check if Inflection AI is configured with shorter timeout
  if (process.env.INFLECTION_API_KEY && process.env.INFLECTION_API_URL) {
    try {
      // Build context for Inflection AI
      const aiContext = [
        ...context.slice(-5),
        { text: message, type: "Human" }
      ];

      console.log('Sending to Inflection AI:', {
        context: aiContext,
        config: "Pi-3.1"
      });

      const response = await axios.post(
        process.env.INFLECTION_API_URL,
        {
          context: aiContext,
          config: "Pi-3.1"
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.INFLECTION_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 8000 // Reduced from 30s to 8s for faster response
        }
      );

      const aiResponse = response.data.text || 'No response generated';
      res.json({ response: aiResponse });
      return;

    } catch (error) {
      console.error('Inflection AI Error:', error.response?.status || error.message);
      // Don't wait for Gemini, use quick response
      return res.json({ response: getEnhancedResponse(message.toLowerCase()) });
    }
  }

  // Try Gemini with shorter timeout
  tryGemini(message, res);
});

// Quick local responses for immediate replies
function getQuickResponse(message) {
  const responses = {
    // Greetings
    'hello': "Hello! I'm here to support you. How can I help you today?",
    'hi': "Hi there! I'm here to listen and help. What's on your mind?",
    'hey': "Hey! I'm here for you. How can I assist you?",
    
    // Help and Support
    'help': "I understand you're looking for help. Our support team is available 24/7. You can also submit a support request through the platform.",
    'support': "Our support team is here for you 24/7. You can reach out anytime you need assistance.",
    'crisis': "If you're in crisis, please contact emergency services immediately: 911 (US) or your local emergency number.",
    'emergency': "For immediate emergencies, please call 911 (US) or your local emergency services right away.",
    
    // Emotional Support
    'sad': "I hear that you're feeling sad, and I want you to know that your feelings are valid. Our counselors are here to support you.",
    'scared': "It's completely understandable to feel scared. You don't have to face this alone. Help is available.",
    'lonely': "Feeling lonely is hard, but please know you're not alone. Our community is here to support you.",
    'worried': "I understand your worry. Let's focus on what we can do to help you feel safer and supported.",
    
    // Platform Features
    'evidence': "You can securely upload and store evidence through our Evidence Vault feature. It's encrypted and safe.",
    'chat': "This chat is here to provide immediate support and guidance. I'm here to listen and help.",
    'dashboard': "Your dashboard gives you access to all features: support requests, evidence vault, and emergency contacts.",
    'account': "Your account is secure and private. You can manage your preferences and privacy settings.",
    
    // Practical Information
    'hours': "Our support team is available 24/7. You can reach out anytime, day or night.",
    'contact': "You can contact our support team through the platform, submit requests, or use the emergency contacts.",
    'safe': "Your safety is our priority. The platform is designed to keep your information secure and private.",
    'anonymous': "You can use the platform anonymously for certain features. Your privacy is protected.",
    
    // Default positive responses
    'ok': "I'm here for you. Is there anything specific you'd like to talk about?",
    'thank': "You're welcome. Remember, you don't have to go through this alone.",
    'bye': "Take care of yourself. Remember, support is always available when you need it."
  };
  
  for (const [key, response] of Object.entries(responses)) {
    if (message.includes(key)) {
      return response;
    }
  }
  
  return null; // No quick match found
}

// Enhanced fallback response with more variety
function getEnhancedResponse(message) {
  const responses = [
    "Thank you for reaching out. Our support team is here for you 24/7. How can I help you today?",
    "I'm here to listen and support you. You can submit a support request or speak with our counselors.",
    "Your wellbeing matters to us. Please don't hesitate to reach out for help whenever you need it.",
    "Remember, you have support available. Our team is here to help you through any challenges.",
    "I'm here for you. If you need immediate assistance, our support team is available around the clock."
  ];
  
  // Return a response based on message length and content
  if (message.length < 10) {
    return responses[0];
  } else if (message.includes('?')) {
    return responses[1];
  } else if (message.includes('help') || message.includes('support')) {
    return responses[2];
  } else {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

async function tryGemini(message, res) {
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('Trying Google Gemini as fallback...');
      
      const geminiResponse = await axios.post(
        `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `You are a compassionate AI assistant for a survivor support platform. Respond helpfully and supportively to: ${message}`
            }]
          }]
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000 // Reduced from 15s to 5s for faster response
        }
      );
      
      const aiResponse = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m here to support you.';
      console.log('Gemini response successful');
      return res.json({ response: aiResponse });
      
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError.message);
    }
  }
  
  // Enhanced final fallback
  res.json({ response: getEnhancedResponse(message.toLowerCase()) });
}

module.exports = router;