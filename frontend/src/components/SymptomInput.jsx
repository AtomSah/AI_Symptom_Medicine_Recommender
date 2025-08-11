import React from 'react';
import { Send, Loader2 } from 'react';

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

export default SymptomInput;