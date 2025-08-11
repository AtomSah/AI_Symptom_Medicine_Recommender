const axios = require('axios');

class AIService {
  constructor() {
    this.baseURL = process.env.AI_API_URL || 'http://localhost:8000';
    this.timeout = 30000; // 30 seconds
    
    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ AI API response: ${response.status}`);
        return response;
      },
      (error) => {
        console.error(`❌ AI API error: ${error.message}`);
        throw error;
      }
    );
  }
  
  async predictMedicine(symptoms) {
    try {
      console.log(`🤖 Calling AI API with symptoms: "${symptoms}"`);
      
      const response = await this.client.post('/predict', {
        symptoms: symptoms
      });
      
      return response.data;
      
    } catch (error) {
      console.error('AI Service error:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('AI service is not available');
      }
      
      if (error.response) {
        throw error; // Pass the axios error with response data
      }
      
      throw new Error('Failed to get prediction from AI service');
    }
  }
  
  async getModelInfo() {
    try {
      const response = await this.client.get('/model-info');
      return response.data;
    } catch (error) {
      console.error('Failed to get model info:', error.message);
      throw error;
    }
  }
  
  async checkHealth() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('AI service health check failed:', error.message);
      throw error;
    }
  }
}

module.exports = new AIService();