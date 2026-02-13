"""
Script to train and save ML models for health risk prediction
This creates sample models using synthetic data for demonstration purposes
For production, replace with real medical datasets
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Create ml_models directory if it doesn't exist
os.makedirs('../app/ml_models', exist_ok=True)

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic health data for training"""
    np.random.seed(42)
    
    # Features: age, bmi, bp_systolic, bp_diastolic, blood_sugar
    age = np.random.randint(20, 80, n_samples)
    bmi = np.random.normal(25, 5, n_samples)
    bp_systolic = np.random.randint(90, 180, n_samples)
    bp_diastolic = np.random.randint(60, 120, n_samples)
    blood_sugar = np.random.randint(70, 200, n_samples)
    
    # Create DataFrame
    data = pd.DataFrame({
        'age': age,
        'bmi': bmi,
        'bp_systolic': bp_systolic,
        'bp_diastolic': bp_diastolic,
        'blood_sugar': blood_sugar
    })
    
    # Generate labels based on simple rules (for demonstration)
    # Diabetes: high blood sugar, high BMI
    diabetes = ((blood_sugar > 125) | (bmi > 30)).astype(int)
    
    # Heart disease: high BP, older age
    heart_disease = ((bp_systolic > 140) | (age > 60)).astype(int)
    
    # Obesity: high BMI
    obesity = (bmi > 30).astype(int)
    
    return data, diabetes, heart_disease, obesity

def train_models():
    """Train and save all ML models"""
    print("Generating synthetic training data...")
    X, y_diabetes, y_heart, y_obesity = generate_synthetic_data(1000)
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Save scaler
    joblib.dump(scaler, '../app/ml_models/scaler.pkl')
    print("✓ Saved feature scaler")
    
    # Train models for each condition
    conditions = {
        'diabetes': y_diabetes,
        'heart': y_heart,
        'obesity': y_obesity
    }
    
    algorithms = {
        'lr': LogisticRegression(random_state=42, max_iter=1000),
        'dt': DecisionTreeClassifier(random_state=42, max_depth=5),
        'rf': RandomForestClassifier(random_state=42, n_estimators=100, max_depth=5)
    }
    
    for condition_name, y in conditions.items():
        print(f"\nTraining models for {condition_name}...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        for algo_name, model in algorithms.items():
            # Train model
            model.fit(X_train, y_train)
            
            # Evaluate
            train_score = model.score(X_train, y_train)
            test_score = model.score(X_test, y_test)
            
            # Save model
            model_filename = f'../app/ml_models/{condition_name}_{algo_name}.pkl'
            joblib.dump(model, model_filename)
            
            print(f"  ✓ {algo_name.upper()}: Train={train_score:.3f}, Test={test_score:.3f}")
    
    print("\n✅ All models trained and saved successfully!")
    print("Models saved in: ../app/ml_models/")

if __name__ == '__main__':
    train_models()
