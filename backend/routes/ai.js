const express = require('express');
const axios = require('axios');
const router = express.Router();

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  const { message, context = [] } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check if Inflection AI is configured
  if (!process.env.INFLECTION_API_KEY || !process.env.INFLECTION_API_URL) {
    console.log('Inflection AI not configured, using Gemini fallback');
    return tryGemini(message, res);
  }

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
        timeout: 30000
      }
    );

    const aiResponse = response.data.text || 'No response generated';
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Inflection AI Error:', error.response?.status || error.message);
    return tryGemini(message, res);
  }
});

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
          timeout: 15000
        }
      );
      
      const aiResponse = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m here to support you.';
      console.log('Gemini response successful');
      return res.json({ response: aiResponse });
      
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError.message);
    }
  }
  
  // Final fallback
  const userMessage = message.toLowerCase();
  let fallbackResponse;
  
  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    fallbackResponse = "Hello! I'm here to support you. Our support team is available 24/7.";
  } else if (userMessage.includes('help') || userMessage.includes('support')) {
    fallbackResponse = "I understand you're looking for help. Please consider reaching out to our counselors.";
  } else {
    fallbackResponse = "Thank you for reaching out. Support is always available - our counselors are here 24/7.";
  }
  
  res.json({ response: fallbackResponse });
}

module.exports = router;