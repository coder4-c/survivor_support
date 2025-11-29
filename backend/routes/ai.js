const express = require('express');
const axios = require('axios');
const router = express.Router();

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if Inflection AI is configured
    if (!process.env.INFLECTION_API_KEY || !process.env.INFLECTION_API_URL) {
      console.log('Inflection AI not configured, using fallback response');
      
      // Provide helpful fallback responses
      const fallbackResponses = [
        "I'm here to support you. While our AI service is being set up, please know that you're not alone in this journey.",
        "Thank you for reaching out. Our support team is available 24/7 if you need immediate assistance.",
        "I understand you're looking for support. Please consider reaching out to our counselors or using the emergency resources if you need immediate help.",
        "Your safety and wellbeing are our priority. While I'm getting set up, please don't hesitate to use our other support resources."
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return res.json({ response: randomResponse });
    }

    // Build context for Inflection AI
    const aiContext = [
      ...context.slice(-5), // Keep last 5 messages for context
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
        timeout: 30000
      }
    );

    console.log('Inflection AI response:', response.data);

    const aiResponse = response.data.text || 'No response generated';
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('AI API Error:', error.response?.status || error.message);
    
    // Provide contextual fallback responses based on user message
    const userMessage = message.toLowerCase();
    let fallbackResponse;
    
    if (userMessage.includes('hello') || userMessage.includes('hi')) {
      fallbackResponse = "Hello! I'm here to support you. While our AI service is temporarily unavailable, please know that you're not alone. Our support team is available 24/7 if you need assistance.";
    } else if (userMessage.includes('help') || userMessage.includes('support')) {
      fallbackResponse = "I understand you're looking for help. Even though I'm experiencing technical difficulties, there are people ready to support you. Please consider reaching out to our counselors or using our emergency resources.";
    } else if (userMessage.includes('emergency') || userMessage.includes('crisis')) {
      fallbackResponse = "If you're in immediate danger, please contact emergency services (911) or our crisis hotline immediately. Your safety is the top priority.";
    } else {
      fallbackResponse = "Thank you for reaching out. While I'm having some technical difficulties connecting to our AI service, please know that support is always available. Our counselors are here 24/7 to help you.";
    }
    
    res.json({ response: fallbackResponse });
  }
});

module.exports = router;