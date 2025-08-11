import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'react';

const VoiceInput = ({ onResult, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onResult]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <Volume2 className="w-6 h-6 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          Voice input not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-3">
        Or use voice input to describe your symptoms
      </p>
      
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

export default VoiceInput;