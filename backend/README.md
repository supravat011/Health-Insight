# Intelligent Health Risk Prediction System - Backend

Flask-based REST API with machine learning integration for health risk prediction.

## Features

- 🔐 JWT-based authentication
- 👤 User profile management
- 🩺 Health data tracking with auto BMI calculation
- 🤖 ML-powered predictions (Diabetes, Heart Disease, Obesity)
- 📊 Risk scoring (0-100 scale)
- 💡 Personalized health recommendations
- 📈 Dashboard with statistics and timeline

## Tech Stack

- **Framework**: Flask 3.0
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: JWT (Flask-JWT-Extended)
- **ML**: Scikit-learn (Logistic Regression, Decision Tree, Random Forest)
- **Password Hashing**: Bcrypt

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example env file
copy .env.example .env

# Edit .env and update SECRET_KEY and JWT_SECRET_KEY
```

### 4. Train ML Models

```bash
cd scripts
python train_models.py
cd ..
```

### 5. Run the Server

```bash
python run.py
```

Server will start at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/history` - Get health history

### Health Records
- `POST /api/health/record` - Create health record
- `GET /api/health/records` - Get all records (paginated)
- `GET /api/health/record/:id` - Get specific record

### Predictions
- `POST /api/predict` - Generate prediction
- `GET /api/predictions` - Get prediction history
- `GET /api/prediction/:id` - Get specific prediction

### Dashboard
- `GET /api/dashboard/stats` - Get summary statistics
- `GET /api/dashboard/timeline` - Get timeline data

## API Usage Example

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "age": 30,
    "gender": "male"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Create Health Record (use token from login)
```bash
curl -X POST http://localhost:5000/api/health/record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "height": 175,
    "weight": 80,
    "blood_pressure_systolic": 120,
    "blood_pressure_diastolic": 80,
    "blood_sugar": 100
  }'
```

### 4. Generate Prediction
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "health_record_id": 1
  }'
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Configuration
│   ├── models/              # Database models
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic (ML, risk scoring, recommendations)
│   ├── utils/               # Utilities (validators, decorators)
│   └── ml_models/           # Trained ML models
├── scripts/
│   └── train_models.py      # Model training script
├── requirements.txt
├── .env.example
└── run.py                   # Application entry point
```

## ML Models

The system uses three algorithms for each condition:
- **Logistic Regression** (lr)
- **Decision Tree** (dt)
- **Random Forest** (rf) - Preferred

Conditions predicted:
- Diabetes
- Heart Disease
- Obesity

## Medical Disclaimer

⚠️ **IMPORTANT**: This system provides health risk predictions for informational purposes only and should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.

## Development

### Running Tests
```bash
pytest tests/ -v
```

### Database Reset
```bash
# Delete database file
rm health_insight.db

# Restart server (will recreate tables)
python run.py
```
