import React from 'react';
import { Pill, Clock, AlertCircle, RotateCcw, CheckCircle } from 'react';

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
      <div className="gradient-bg text-white p-6">
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
        <div className="card-hover bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
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
              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
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

export default ResultsDisplay;