import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import nltk
import os
import re



# Download NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def create_sample_data():
    """Create sample symptom-medicine dataset for thesis demo"""
    data = {
        'symptoms': [
            'headache pain head hurts',
            'fever high temperature hot',
            'cough dry cough throat',
            'stomach pain abdominal pain belly ache',
            'nausea vomiting feel sick',
            'diarrhea loose stool stomach upset',
            'constipation hard stool difficulty',
            'sore throat throat pain swallowing pain',
            'runny nose nasal congestion stuffy nose',
            'muscle pain body ache sore muscles',
            'joint pain arthritis stiff joints',
            'heartburn acid reflux chest burning',
            'allergic reaction itching skin rash',
            'insomnia sleep problem cant sleep',
            'anxiety stress nervous worried',
            'cold symptoms sneezing runny nose',
            'flu symptoms fever body ache',
            'migraine severe headache light sensitivity',
            'back pain lower back spine pain',
            'toothache dental pain teeth hurt',
            'headache severe pain temples',
            'high fever temperature chills',
            'persistent cough chest congestion',
            'severe stomach cramps abdominal pain',
            'nausea dizziness motion sickness',
            'chronic diarrhea watery stool',
            'severe constipation bloating gas',
            'throat infection swallowing difficulty',
            'blocked nose sinus congestion',
            'muscle cramps leg pain spasms',
        ],
        'medicine': [
            'Paracetamol',
            'Paracetamol',
            'Cough Syrup',
            'Antacid',
            'Anti-nausea tablets',
            'Anti-diarrheal',
            'Laxative',
            'Throat lozenges',
            'Decongestant',
            'Pain relief gel',
            'Anti-inflammatory',
            'Antacid',
            'Antihistamine',
            'Sleep aid',
            'Stress relief tablets',
            'Cold medicine',
            'Flu medicine',
            'Migraine relief',
            'Pain relief',
            'Dental gel',
            'Paracetamol',
            'Paracetamol',
            'Cough Syrup',
            'Antacid',
            'Anti-nausea tablets',
            'Anti-diarrheal',
            'Laxative',
            'Throat lozenges',
            'Decongestant',
            'Pain relief gel',
        ],
        'description': [
            'For headache and mild pain relief',
            'Reduces fever and body temperature',
            'Relieves cough and throat irritation',
            'Neutralizes stomach acid',
            'Prevents nausea and vomiting',
            'Controls loose motions',
            'Relieves constipation',
            'Soothes sore throat',
            'Clears nasal congestion',
            'Topical pain relief for muscles',
            'Reduces joint inflammation',
            'Treats heartburn and acid reflux',
            'Relieves allergic reactions',
            'Helps with sleep disorders',
            'Reduces anxiety and stress',
            'Treats common cold symptoms',
            'Relieves flu symptoms',
            'Specific for severe headaches',
            'General pain relief',
            'Numbs tooth pain',
            'Strong headache relief',
            'High fever reduction',
            'Chest congestion relief',
            'Severe stomach pain relief',
            'Motion sickness prevention',
            'Chronic diarrhea treatment',
            'Strong constipation relief',
            'Throat infection treatment',
            'Sinus congestion relief',
            'Muscle spasm relief',
        ]
    }
    
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/symptoms_data.csv', index=False)
    print("Sample dataset created!")
    return df

def preprocess_text(text):
    """Simple text preprocessing"""
    # Convert to lowercase
    text = text.lower()
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Remove extra whitespaces
    text = ' '.join(text.split())
    return text

def train_model():
    """Train the medicine recommendation model"""
    
    # Create sample data if it doesn't exist
    if not os.path.exists('data/symptoms_data.csv'):
        df = create_sample_data()
    else:
        df = pd.read_csv('data/symptoms_data.csv')
    
    print(f"Dataset shape: {df.shape}")
    
    # Preprocess symptoms
    df['symptoms_clean'] = df['symptoms'].apply(preprocess_text)
    
    # Prepare features and labels
    X = df['symptoms_clean']
    y = df['medicine']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # TF-IDF Vectorization
    print("Creating TF-IDF vectors...")
    vectorizer = TfidfVectorizer(
        max_features=1000,
        ngram_range=(1, 2),
        stop_words='english'
    )
    
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    # Train Random Forest model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10
    )
    
    model.fit(X_train_tfidf, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model Accuracy: {accuracy:.2f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model and vectorizer
    os.makedirs('data/models', exist_ok=True)
    joblib.dump(model, 'data/models/medicine_classifier.pkl')
    joblib.dump(vectorizer, 'data/models/tfidf_vectorizer.pkl')
    
    # Save medicine info for predictions
    medicine_info = df[['medicine', 'description']].drop_duplicates()
    medicine_info.to_csv('data/models/medicine_info.csv', index=False)
    
    print("Model saved successfully!")
    return model, vectorizer

if __name__ == "__main__":
    train_model()