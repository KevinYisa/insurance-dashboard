📋 Table of Contents
Project Overview

Architecture

Technology Stack

Features

Project Structure

Setup & Installation

Prerequisites

Database Setup

Python ML Pipeline

Go Backend

React Frontend

API Documentation

Model Performance

Deployment

Contributing

License

Project Overview
This project delivers a production-ready health insurance premium prediction system. It combines:

Data Pipeline: Fetches and processes medical insurance data from PostgreSQL

Machine Learning: Trains and evaluates multiple models (Linear Regression, Random Forest, XGBoost)

Feature Engineering: Creates domain-specific risk indicators

Backend API: Lightweight Go server with sub-millisecond inference

Frontend Dashboard: Modern React interface with interactive visualizations

Key Innovation
Unlike traditional ML deployments that require Python runtime, this system exports model parameters as JSON, enabling pure mathematical inference in Go. This yields:

10-100x faster predictions

No Python dependency in production

Easy scaling and containerization

Architecture
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Data Layer                                        │
│                  Neon PostgreSQL (Cloud Database)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Python ML Pipeline (Offline)                         │
│                                                                             │
│  ┌──────────────┐    ┌────────────────┐    ┌──────────────────────────┐    │
│  │ Fetch Data   │───▶│ Preprocessing  │───▶│ Feature Engineering      │    │
│  │ (SQLAlchemy) │    │ (Scaling, OHE) │    │ (3 Risk Indicators)      │    │
│  └──────────────┘    └────────────────┘    └──────────────────────────┘    │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                     Model Training & Evaluation                    │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │     │
│  │  │   Linear     │  │   Random     │  │   XGBoost   │            │     │
│  │  │  Regression  │  │   Forest     │  │             │            │     │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                    │                                         │
│                                    ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                     Export Artifacts                              │     │
│  │  • preprocessing_params.json (scalers, encoders)                  │     │
│  │  • linear_coefs.json (weights for Go inference)                   │     │
│  │  • feature_importances.json (explainability)                     │     │
│  │  • test_predictions.json (accuracy visualization)                │     │
│  └────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Go Backend API                                       │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  Load JSON parameters at startup                                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                    │                                         │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  /predict     │  /accuracy-data  │  /feature-importance          │     │
│  └────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       React Dashboard (Netlify)                             │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Predict    │  │   Results    │  │   What-If    │  │   Charts     │   │
│  │    Form      │  │    Card      │  │   Sliders    │  │   (Recharts) │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
Technology Stack
Data Layer
Neon PostgreSQL - Serverless cloud database

SQLAlchemy - Python ORM

psycopg2-binary - PostgreSQL adapter

ML Pipeline (Python)
pandas - Data manipulation

numpy - Numerical computing

scikit-learn - Preprocessing & models

xgboost - Gradient boosting

joblib - Model serialization

Backend (Go)
net/http - Standard library HTTP server

chi - Lightweight router

CORS - Cross-origin resource sharing

Frontend (React)
React 18 - UI library

Vite - Build tool

Recharts - Charting library

Axios - HTTP client

Framer Motion - Animations

React Scroll - Smooth navigation

Features
1. Real-time Premium Prediction
Instant predictions using pure mathematical inference

Converts USD to ZAR with configurable exchange rate

Returns annual expenses, monthly premium, and budget recommendation

2. Engineered Risk Indicators
Three domain-specific features:

Obesity Age Score: (BMI × Age) / 100 - Captures metabolic risk

Dependency Load: Children × (Age / 50) - Measures financial strain

Lifestyle Penalty: (1 - discount_eligibility) × (BMI / 30) - Identifies high-risk non-discount individuals

3. Risk Profile Classification
Low Risk: Healthy profile, 5% budget buffer

Medium Risk: Moderate factors, 20% buffer

High Risk: Elevated metabolic/lifestyle risk, 40% buffer

4. Interactive Visualizations
Feature Importance Chart: Understand cost drivers

Model Accuracy Line Chart: Actual vs Predicted performance

What-If Sliders: Real-time impact of changing age/BMI/children

5. Modern Dashboard Design
Glass-morphism UI with 3D hover effects

Custom animated checkbox and sliders

Typing text animation

Smooth scroll navigation

Responsive across all devices

Project Structure
text
Health Insurance MLM/
│
├── Model/                                    # Python ML Pipeline
│   ├── config.json                           # Configuration file
│   ├── Fetch_data.py                         # Database fetching script
│   ├── preprocessing.py                      # Feature engineering & scaling
│   ├── train_model.py                        # Model training & evaluation
│   ├── requirements.txt                      # Python dependencies
│   └── preprocessing_outputs/                # Generated artifacts
│       ├── preprocessing_params.json         # Scaling & encoding params
│       ├── linear_coefs.json                 # Model weights for Go
│       ├── feature_importances.json          # Feature importance scores
│       ├── test_predictions.json             # Actual vs Predicted
│       └── best_model.pkl                    # Serialized model (Python)
│
├── backend/                                  # Go Backend API
│   ├── data/                                 # JSON parameters
│   │   ├── preprocessing_params.json
│   │   ├── linear_coefs.json
│   │   ├── feature_importances.json
│   │   └── test_predictions.json
│   ├── go.mod                                # Go dependencies
│   ├── go.sum
│   └── main.go                               # Main server code
│
└── frontend/                                 # React Dashboard
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── client.js                     # Axios API client
    │   ├── assets/
    │   │   └── sections/                     # Background images (1-5.jpg)
    │   ├── components/
    │   │   ├── Navigation.jsx                # Fixed nav with scroll
    │   │   ├── SectionBackground.jsx         # Background wrapper
    │   │   ├── CurvedBox.jsx                 # Glass-morphism card
    │   │   ├── TypingText.jsx                # Typing animation
    │   │   ├── PredictForm.jsx               # Input form
    │   │   ├── ResultsCard.jsx               # Prediction display
    │   │   ├── WhatIfSliders.jsx             # Interactive sliders
    │   │   ├── FeatureImportance.jsx         # Bar chart
    │   │   └── AccuracyLineChart.jsx         # Line chart
    │   ├── hooks/
    │   │   └── usePrediction.js              # Custom hook for state
    │   ├── sections/
    │   │   ├── HeroSection.jsx               # Section 1
    │   │   ├── PredictorSection.jsx          # Section 2
    │   │   ├── FeaturesSection.jsx           # Section 3
    │   │   ├── AccuracySection.jsx           # Section 4
    │   │   └── FutureSection.jsx             # Section 5
    │   ├── App.jsx                           # Main app component
    │   ├── App.css                           # Global styles
    │   ├── index.css                         # Base styles
    │   └── main.jsx                          # Entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
Setup & Installation
Prerequisites
Python 3.9+ - Download

Go 1.21+ - Download

Node.js 18+ - Download

PostgreSQL Database (Neon, AWS RDS, or local)

Database Setup
Create a Neon PostgreSQL database (or use your existing)

Create the table:

sql
CREATE TABLE medical_insurance (
    age INT,
    gender VARCHAR(10),
    bmi FLOAT,
    children INT,
    discount_eligibility BOOLEAN,
    region VARCHAR(20),
    expenses FLOAT,
    premium FLOAT
);
Create a .env file in the Model/ directory:

text
DATABASE_URL=postgresql://username:password@host:port/database
Load sample data (optional) using Fetch_data.py.

Python ML Pipeline
bash
# Navigate to Model directory
cd Model

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Fetch data from database
python Fetch_data.py

# Run preprocessing & feature engineering
python preprocessing.py

# Train models and export artifacts
python train_model.py
Expected Output:

preprocessing_outputs/preprocessing_params.json

preprocessing_outputs/linear_coefs.json

preprocessing_outputs/feature_importances.json

preprocessing_outputs/test_predictions.json

preprocessing_outputs/best_model.pkl

Go Backend
bash
# Navigate to backend directory
cd backend

# Copy JSON files from Python output
cp ../Model/preprocessing_outputs/*.json data/

# Download dependencies
go mod tidy

# Run the server
go run main.go
Server runs on: http://localhost:8080

React Frontend
bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Add background images to src/assets/sections/
# Name them: 1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg

# Start development server
npm run dev
Frontend runs on: http://localhost:5173

API Documentation
POST /predict
Predict insurance expenses based on user profile.

Request Body:

json
{
    "age": 30,
    "gender": "male",
    "bmi": 25.0,
    "children": 0,
    "discount_eligibility": true,
    "region": "southwest"
}
Response:

json
{
    "predicted_expenses_usd": 16439.53,
    "predicted_expenses_zar": 304131.31,
    "monthly_premium_zar": 3041.31,
    "recommended_annual_budget_zar": 319337.88,
    "engineered_features": {
        "obesity_age_score": 7.5,
        "dependency_load": 0,
        "lifestyle_penalty": 0
    },
    "risk_profile": {
        "category": "Low",
        "budget_multiplier": 1.05,
        "description": "Healthy profile. Standard insurance with minimal buffer recommended."
    },
    "status": "success"
}
GET /accuracy-data
Returns actual vs predicted values for model evaluation.

Response:

json
{
    "actual": [16439.53, 9243.32, ...],
    "predicted": [15200.12, 9800.45, ...]
}
GET /feature-importance
Returns feature importance scores for explainability.

Response:

json
{
    "importances": [0.234, 0.189, 0.102, ...],
    "model_type": "RandomForestRegressor"
}
GET /health
Health check endpoint.

Response: {"status":"healthy"}

Model Performance
Model Comparison Results
Model	Test R²	Test RMSE	Test MAE
Linear Regression	0.7421	5421.32	4123.45
Random Forest	0.7842	4823.67	3654.21
XGBoost	0.7814	4890.12	3689.77
Production Model: Linear Regression (used in Go for speed)
Best Performing Model: Random Forest (used for Python evaluation)

Feature Importance (Top 5)
Obesity Age Score - 23.4% - Combines age and BMI for metabolic risk

BMI - 18.9% - Body mass index impact

Lifestyle Penalty - 10.2% - Non-discount high-BMI individuals

Age - 8.7% - Base age risk

Dependency Load - 6.5% - Children × Age interaction

Deployment
Deploy Go Backend (Render)
Push code to GitHub

Create new Web Service on Render

Connect repository

Set Build Command: go build -o app

Set Start Command: ./app

Add environment variables if needed

Deploy React Frontend (Netlify)
Build the project: npm run build

Push to GitHub or drag dist folder to Netlify

Configure environment variable: VITE_API_URL=https://your-go-api.onrender.com

Deploy Python Pipeline (Optional)
For automated retraining:

Use GitHub Actions or cron job

Run python train_model.py weekly

Commit new JSON files to repository

Trigger Go backend redeploy

Contributing
Development Workflow
Fork the repository

Create a feature branch: git checkout -b feature/amazing-feature

Make changes following existing patterns

Test thoroughly:

Python: pytest tests/

Go: go test ./...

React: npm test

Commit changes: git commit -m 'Add amazing feature'

Push to branch: git push origin feature/amazing-feature

Open a Pull Request

Adding New Features
To add a new engineered feature:

Update preprocessing.py → engineer_features() function

Update train_model.py → export updated JSON

Update Go main.go → engineerFeatures() function

Update React FeatureImportance.jsx → feature labels

To add a new model:

Add model to train_model.py training loop

Export coefficients to linear_coefs.json

Update Go inference if using new model

Environment Variables
Python (.env)
text
DATABASE_URL=postgresql://user:pass@host:port/db
Go (Optional)
text
PORT=8080
USD_TO_ZAR=18.50
React (.env)
text
VITE_API_URL=http://localhost:8080
Troubleshooting
CORS Errors
Ensure main.go includes your frontend URL:

go
AllowedOrigins: []string{"http://localhost:5173", "https://your-app.netlify.app"}
JSON File Not Found
Copy files from Model/preprocessing_outputs/ to backend/data/:

bash
cp ../Model/preprocessing_outputs/*.json backend/data/
Database Connection Failed
Check .env file and ensure Neon PostgreSQL is running. Use test_connection() in Fetch_data.py.

React Build Fails
Clear cache and reinstall:

bash
rm -rf node_modules package-lock.json
npm install
npm run dev
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
Dataset: Medical Cost Personal Dataset (public domain)

Font: Audiowide (Google Fonts) for Octane-style headings

EB Garamond (Google Fonts) for body text

Background images: Unsplash (free for commercial use)

Contact
For questions, issues, or contributions, please open a GitHub issue or contact the development team.

