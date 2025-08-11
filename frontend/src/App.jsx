import React, { useState } from 'react';
import { Stethoscope, AlertTriangle, Mic, MicOff, Send, Loader2, Pill, CheckCircle, RotateCcw, Clock } from 'lucide-react';

// Voice Input Component
const VoiceInput = ({ onResult, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  React.useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <div className="w-6 h-6 mx-auto text-gray-400 mb-2">🎤</div>
        <p className="text-sm text-gray-600">Voice input not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-3">Or use voice input to describe your symptoms</p>
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          isListening
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5 mr-2" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 mr-2" />
            Start Voice Input
          </>
        )}
      </button>
      
      {isListening && (
        <div className="mt-3 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="ml-2 text-sm text-red-600">Listening...</span>
        </div>
      )}
    </div>
  );
};

// Symptom Input Component
const SymptomInput = ({ symptoms, onSymptomsChange, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(symptoms);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your symptoms (e.g., "headache and fever", "stomach pain and nausea")
        </label>
        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => onSymptomsChange(e.target.value)}
          placeholder="Describe how you're feeling..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
          disabled={loading}
          maxLength="1000"
        />
        <div className="text-xs text-gray-500 mt-1">
          {symptoms.length}/1000 characters
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading || !symptoms.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Get Medicine Recommendation
          </>
        )}
      </button>
    </form>
  );
};

// Results Display Component
const ResultsDisplay = ({ results, onClear }) => {
  const confidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const confidenceText = (confidence) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 mr-3" />
            <div>
              <h2 className="text-2xl font-semibold">Recommendation Ready</h2>
              <p className="opacity-90">Based on your symptoms analysis</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors duration-200"
            title="Clear results"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Recommendation */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Pill className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {results.predicted_medicine}
                </h3>
                <p className="text-gray-600 mt-1">
                  {results.description}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${confidenceColor(results.confidence)}`}>
              {confidenceText(results.confidence)} ({Math.round(results.confidence * 100)}%)
            </div>
          </div>
        </div>

        {/* Alternative Suggestions */}
        {results.alternative_suggestions && results.alternative_suggestions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Alternative Suggestions
            </h4>
            <div className="space-y-3">
              {results.alternative_suggestions.slice(0, 2).map((suggestion, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-800">{suggestion.medicine}</h5>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round(suggestion.confidence * 100)}% match
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Symptoms Analysis */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-2">Your Symptoms</h4>
          <p className="text-gray-600 italic">"{results.input_symptoms}"</p>
          {results.processed_symptoms && (
            <p className="text-xs text-gray-500 mt-2">
              Processed: {results.processed_symptoms}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Response time: {results.metadata?.responseTime || 'N/A'}
          </div>
          <div>
            {new Date(results.timestamp).toLocaleString()}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Medical Disclaimer:</strong> {results.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Demo prediction function (simulates API call)
  const handlePrediction = async (symptomText) => {
    if (!symptomText.trim()) {
      setError('Please enter your symptoms');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    // Simulate API call with demo data
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

      // Demo prediction logic
      const lowerSymptoms = symptomText.toLowerCase();
      let predictedMedicine = 'Paracetamol';
      let description = 'For general pain relief and fever reduction';
      let confidence = 0.85;

      if (lowerSymptoms.includes('stomach') || lowerSymptoms.includes('nausea') || lowerSymptoms.includes('acid')) {
        predictedMedicine = 'Antacid';
        description = 'Neutralizes stomach acid and relieves heartburn';
        confidence = 0.78;
      } else if (lowerSymptoms.includes('cough') || lowerSymptoms.includes('throat')) {
        predictedMedicine = 'Cough Syrup';
        description = 'Relieves cough and throat irritation';
        confidence = 0.82;
      } else if (lowerSymptoms.includes('diarrhea') || lowerSymptoms.includes('loose stool')) {
        predictedMedicine = 'Anti-diarrheal';
        description = 'Controls loose motions and stomach upset';
        confidence = 0.76;
      }

      const mockResults = {
        predicted_medicine: predictedMedicine,
        description: description,
        confidence: confidence,
        input_symptoms: symptomText,
        processed_symptoms: symptomText.toLowerCase().replace(/[^a-zA-Z\s]/g, ''),
        timestamp: new Date().toISOString(),
        disclaimer: 'This is for educational purposes only. Consult a healthcare professional for proper medical advice.',
        metadata: {
          responseTime: '1.8s'
        }
      };

      // Add alternative suggestions if confidence is low
      if (confidence < 0.8) {
        mockResults.alternative_suggestions = [
          {
            medicine: 'Ibuprofen',
            description: 'Anti-inflammatory pain relief',
            confidence: confidence - 0.1
          },
          {
            medicine: 'Aspirin',
            description: 'Pain relief and anti-inflammatory',
            confidence: confidence - 0.15
          }
        ];
      }

      setResults(mockResults);
    } catch (err) {
      setError('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceResult = (transcript) => {
    setSymptoms(transcript);
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
    setSymptoms('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="w-12 h-12 mr-3" />
            <h1 className="text-4xl font-bold">AI Medicine Recommender</h1>
          </div>
          <p className="text-xl opacity-90">
            Get over-the-counter medicine recommendations based on your symptoms
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Important:</strong> This tool is for educational purposes only and should not replace professional medical advice. 
              Always consult with a healthcare provider for proper diagnosis and treatment.
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Describe Your Symptoms
          </h2>
          
          <SymptomInput 
            symptoms={symptoms}
            onSymptomsChange={setSymptoms}
            onSubmit={handlePrediction}
            loading={loading}
          />
          
          <div className="mt-4">
            <VoiceInput 
              onResult={handleVoiceResult}
              disabled={loading}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
            <div className="animate-pulse">
              <Stethoscope className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            </div>
            <p className="text-lg text-gray-600">
              Analyzing your symptoms...
            </p>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <ResultsDisplay 
            results={results}
            onClear={clearResults}
          />
        )}

        {/* Demo Instructions */}
        {!results && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Try These Example Symptoms:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSymptoms('headache and fever')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm"
              >
                "headache and fever"
              </button>
              <button
                onClick={() => setSymptoms('stomach pain and nausea')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm"
              >
                "stomach pain and nausea"
              </button>
              <button
                onClick={() => setSymptoms('cough and sore throat')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm"
              >
                "cough and sore throat"
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-300">
            AI Medicine Recommender - Thesis Project 2024
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Built with React, Node.js, and Python ML
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;