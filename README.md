# Health Insight Hub

An intelligent health risk prediction system that uses machine learning to assess your risk for diabetes, heart disease, and obesity. Get personalized health recommendations based on your health data.

![Health Insight Hub](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![Flask](https://img.shields.io/badge/Flask-3.1-green)
![Python](https://img.shields.io/badge/Python-3.8+-yellow)

## 🌟 Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

### 🏥 Health Assessment
- Multi-step health data collection form
- Automatic BMI calculation
- Comprehensive health metrics tracking:
  - Height, weight, blood pressure
  - Blood sugar levels
  - Physical activity and lifestyle factors

### 🤖 AI-Powered Predictions
- Machine learning models for risk prediction:
  - **Diabetes Risk** - Logistic Regression
  - **Heart Disease Risk** - Decision Tree
  - **Obesity Risk** - Random Forest
- Overall health risk scoring (0-100)
- Risk categorization (Low/Medium/High)

### 💡 Personalized Recommendations
- Custom diet suggestions
- Exercise plans
- Lifestyle modifications
- Medical consultation advice

### 📊 Dashboard & Analytics
- Real-time health statistics
- Assessment timeline with trends
- Historical data visualization
- Risk progression tracking

### 📝 Data Management
- Health records history
- Prediction history
- User profile management
- Data export capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Hook Form** for form management

### Backend
- **Flask** web framework
- **SQLAlchemy** ORM
- **SQLite** database (development)
- **Flask-JWT-Extended** for authentication
- **Flask-CORS** for cross-origin requests
- **scikit-learn** for ML models
- **pandas** & **numpy** for data processing

## 📁 Project Structure

```
Health Insight Hub/
├── backend/                    # Flask backend
│   ├── app/
│   │   ├── __init__.py        # App factory
│   │   ├── config.py          # Configuration
│   │   ├── models/            # Database models
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utilities
│   │   └── ml_models/         # Trained ML models
│   ├── scripts/
│   │   └── train_models.py    # Model training script
│   ├── requirements.txt
│   └── run.py                 # Application entry point
│
├── src/                       # React frontend
│   ├── components/            # Reusable components
│   ├── pages/                 # Page components
│   ├── lib/                   # Utilities & API client
│   ├── hooks/                 # Custom React hooks
│   └── App.tsx                # Main app component
│
├── public/                    # Static assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (3.8 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Train ML models:**
   ```bash
   python scripts/train_models.py
   ```

6. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update configuration as needed

7. **Run the backend server:**
   ```bash
   python run.py
   ```
   
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:8080`

## 📖 Usage

### 1. Create an Account
- Navigate to the signup page
- Enter your name, email, and password
- Accept terms and conditions
- Click "Sign Up"

### 2. Complete Health Assessment
- Login to your account
- Click "Start Health Check" or "New Assessment"
- Fill in the multi-step form:
  - Personal information (age, gender, height, weight)
  - Health metrics (blood pressure, blood sugar)
  - Lifestyle factors (activity level, smoking, alcohol)
- Submit the form

### 3. View Results
- See your overall health risk score
- Review individual disease risks
- Check risk categories and explanations

### 4. Get Recommendations
- View personalized diet suggestions
- See exercise plans
- Read lifestyle modification tips
- Get medical consultation advice

### 5. Track Progress
- Visit the dashboard for overview
- Check prediction history
- Review health records
- Monitor risk trends over time

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API endpoints
- Input validation and sanitization
- CORS configuration
- Secure session management

## 🤖 Machine Learning Models

### Model Performance

| Model | Disease | Algorithm | Accuracy |
|-------|---------|-----------|----------|
| Diabetes Predictor | Diabetes | Logistic Regression | ~85% |
| Heart Disease Predictor | Heart Disease | Decision Tree | ~90% |
| Obesity Predictor | Obesity | Random Forest | ~95% |

### Features Used
- Age, gender, BMI
- Blood pressure (systolic/diastolic)
- Blood sugar levels
- Physical activity level
- Smoking status
- Alcohol consumption
- Family history

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/history` - Get health history

### Health Records
- `POST /api/health/record` - Create health record
- `GET /api/health/records` - Get all records
- `GET /api/health/record/<id>` - Get specific record

### Predictions
- `POST /api/predict` - Generate prediction
- `GET /api/predictions` - Get all predictions
- `GET /api/prediction/<id>` - Get specific prediction

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/timeline` - Get timeline data

## 🎨 Design System

The application uses a modern, accessible design system with:
- Custom color palette for risk levels
- Responsive layouts
- Smooth animations
- Accessible components
- Dark mode support (coming soon)

## 📝 Environment Variables

### Backend (.env)
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///health_insight.db
JWT_SECRET_KEY=your-jwt-secret
CORS_ORIGINS=http://localhost:8080
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Medical Disclaimer

**IMPORTANT:** This application is for informational and educational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for better health awareness

---

**Note:** Make sure both the backend and frontend servers are running for the application to work properly.
