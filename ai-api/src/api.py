from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import re
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global variables for model and vectorizer
model = None
vectorizer = None
medicine_info = None

def load_model():
    """Load the trained model and vectorizer"""
    global model, vectorizer, medicine_info
    
    try:
        model = joblib.load('../data/models/medicine_classifier.pkl')
        vectorizer = joblib.load('../data/models/tfidf_vectorizer.pkl')
        medicine_info = pd.read_csv('../data/models/medicine_info.csv')
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        return False
    return True

def preprocess_text(text):
    """Preprocess user input text"""
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Remove extra whitespaces
    text = ' '.join(text.split())
    return text

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict_medicine():
    """Predict medicine based on symptoms"""
    try:
        # Get symptoms from request
        data = request.get_json()
        symptoms = data.get('symptoms', '')
        
        if not symptoms:
            return jsonify({
                'error': 'No symptoms provided'
            }), 400
        
        # Preprocess symptoms
        processed_symptoms = preprocess_text(symptoms)
        
        if not processed_symptoms:
            return jsonify({
                'error': 'Invalid symptoms format'
            }), 400
        
        # Vectorize symptoms
        symptoms_tfidf = vectorizer.transform([processed_symptoms])
        
        # Get prediction and probabilities
        prediction = model.predict(symptoms_tfidf)[0]
        probabilities = model.predict_proba(symptoms_tfidf)[0]
        classes = model.classes_
        
        # Get confidence score
        max_prob_idx = probabilities.argmax()
        confidence = probabilities[max_prob_idx]
        
        # Get medicine information
        medicine_row = medicine_info[medicine_info['medicine'] == prediction]
        description = medicine_row['description'].iloc[0] if not medicine_row.empty else "General medicine"
        
        # Prepare response
        response = {
            'predicted_medicine': prediction,
            'description': description,
            'confidence': float(confidence),
            'input_symptoms': symptoms,
            'processed_symptoms': processed_symptoms,
            'timestamp': datetime.now().isoformat(),
            'disclaimer': 'This is for educational purposes only. Consult a healthcare professional for proper medical advice.'
        }
        
        # Add top 3 predictions if confidence is low
        if confidence < 0.7:
            top_3_idx = probabilities.argsort()[-3:][::-1]
            top_predictions = []
            
            for idx in top_3_idx:
                med_name = classes[idx]
                med_info = medicine_info[medicine_info['medicine'] == med_name]
                med_desc = med_info['description'].iloc[0] if not med_info.empty else "General medicine"
                
                top_predictions.append({
                    'medicine': med_name,
                    'description': med_desc,
                    'confidence': float(probabilities[idx])
                })
            
            response['alternative_suggestions'] = top_predictions
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    try:
        return jsonify({
            'model_type': 'Random Forest Classifier',
            'vectorizer': 'TF-IDF',
            'features': vectorizer.get_feature_names_out().shape[0] if vectorizer else 0,
            'classes': model.classes_.tolist() if model else [],
            'total_medicines': len(medicine_info) if medicine_info is not None else 0
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Medicine Recommender API...")
    
    # Load the model
    if not load_model():
        print("Failed to load model. Please run train_model.py first.")
        exit(1)
    
    print("Model loaded successfully!")
    print("Starting Flask server on http://localhost:8000")
    
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )