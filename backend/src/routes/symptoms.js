const express = require('express');
const aiService = require('../services/aiService');
const router = express.Router();

// Input validation middleware
const validateSymptoms = (req, res, next) => {
  const { symptoms } = req.body;
  
  if (!symptoms || typeof symptoms !== 'string') {
    return res.status(400).json({
      error: 'Symptoms are required and must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  if (symptoms.trim().length < 3) {
    return res.status(400).json({
      error: 'Symptoms must be at least 3 characters long',
      timestamp: new Date().toISOString()
    });
  }
  
  if (symptoms.length > 1000) {
    return res.status(400).json({
      error: 'Symptoms text is too long (max 1000 characters)',
      timestamp: new Date().toISOString()
    });
  }
  
  // Sanitize input
  req.body.symptoms = symptoms.trim();
  next();
};

// POST /api/symptoms/predict - Get medicine recommendations
router.post('/predict', validateSymptoms, async (req, res) => {
  try {
    const { symptoms } = req.body;
    const startTime = Date.now();
    
    console.log(`📝 New prediction request: "${symptoms}"`);
    
    // Call AI service
    const prediction = await aiService.predictMedicine(symptoms);
    
    const responseTime = Date.now() - startTime;
    console.log(`⚡ Prediction completed in ${responseTime}ms`);
    
    // Add metadata to response
    const response = {
      ...prediction,
      metadata: {
        responseTime: `${responseTime}ms`,
        backend_timestamp: new Date().toISOString(),
        request_id: generateRequestId()
      }
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Prediction error:', error);
    
    // Handle different error types
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'AI service unavailable',
        message: 'The AI model service is currently down. Please try again later.',
        timestamp: new Date().toISOString()
      });
    }
    
    if (error.response && error.response.status === 400) {
      return res.status(400).json({
        error: 'Invalid input',
        message: error.response.data.error || 'Invalid symptoms format',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      error: 'Prediction failed',
      message: 'Unable to process your symptoms. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/symptoms/info - Get available medicines info
router.get('/info', async (req, res) => {
  try {
    const modelInfo = await aiService.getModelInfo();
    res.json(modelInfo);
  } catch (error) {
    console.error('Model info error:', error);
    res.status(500).json({
      error: 'Unable to fetch model information',
      timestamp: new Date().toISOString()
    });
  }
});

// Helper function to generate request ID
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = router;