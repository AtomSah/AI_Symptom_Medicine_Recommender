# AI Medicine Recommender - Thesis Project

A full-stack web application that uses machine learning to recommend over-the-counter medicines based on user symptoms. Built with React, Node.js, and Python.

## 🏗️ Architecture

- **Frontend**: React + Vite (Port 5173)
- **Backend**: Node.js + Express (Port 5000)
- **AI API**: Python Flask + Scikit-learn (Port 8000)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd thesis
```

### 2. Setup AI API (Python)

```bash
cd ai-api

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python train_model.py

# Start the AI API server
python src/api.py
```

The AI API will be available at `http://localhost:8000`

### 3. Setup Backend (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start the backend server
npm start
```

The backend will be available at `http://localhost:5000`

### 4. Setup Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
thesis/
├── ai-api/                 # Python ML API
│   ├── data/              # Model data and training files
│   ├── src/
│   │   └── api.py         # Flask API server
│   ├── train_model.py     # Model training script
│   └── requirements.txt   # Python dependencies
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
│   ├── server.js          # Express server
│   └── package.json
└── frontend/              # React application
    ├── src/
    │   ├── components/    # React components
    │   └── App.jsx        # Main app component
    └── package.json
```

## 🔧 API Endpoints

### AI API (Python - Port 8000)
- `GET /health` - Health check
- `POST /predict` - Get medicine prediction
- `GET /model-info` - Get model information

### Backend API (Node.js - Port 5000)
- `GET /health` - Health check
- `POST /api/symptoms/predict` - Get medicine recommendation
- `GET /api/symptoms/info` - Get model information

## 🎯 Features

- **Symptom Analysis**: Natural language processing of user symptoms
- **Medicine Recommendations**: ML-powered medicine suggestions
- **Voice Input**: Speech-to-text for symptom description
- **Confidence Scoring**: Shows prediction confidence levels
- **Alternative Suggestions**: Multiple medicine options when confidence is low
- **Responsive Design**: Works on desktop and mobile devices

## 🛡️ Security Features

- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet.js security headers
- Error handling and logging

## 📊 Machine Learning Model

- **Algorithm**: Random Forest Classifier
- **Vectorization**: TF-IDF with n-gram features
- **Training Data**: Synthetic symptom-medicine dataset
- **Features**: Text preprocessing, stop word removal, lemmatization

## 🚨 Important Disclaimer

This application is for **educational purposes only**. It should not be used as a substitute for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in the respective `.env` files
2. **Model not found**: Run `python train_model.py` in the ai-api directory
3. **CORS errors**: Check that the frontend URL is correctly set in backend `.env`
4. **Dependencies not found**: Run `npm install` or `pip install -r requirements.txt`

### Health Checks

- AI API: `http://localhost:8000/health`
- Backend: `http://localhost:5000/health`
- Frontend: `http://localhost:5173`

## 📝 Development

### Adding New Medicines

1. Edit the `create_sample_data()` function in `ai-api/train_model.py`
2. Add new symptom-medicine pairs
3. Re-run `python train_model.py`

### Modifying the Model

1. Update the ML pipeline in `ai-api/train_model.py`
2. Adjust hyperparameters or try different algorithms
3. Re-train the model

### Frontend Customization

- Styles: Modify `frontend/src/App.css`
- Components: Edit files in `frontend/src/components/`
- Main app: Modify `frontend/src/App.jsx`

## 📄 License

This project is part of a thesis submission. All rights reserved.

## 🤝 Contributing

This is a thesis project. For academic purposes only.
