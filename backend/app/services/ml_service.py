import os
import joblib
import numpy as np
from flask import current_app

class MLService:
    """Machine Learning prediction service"""
    
    def __init__(self):
        self.models = {}
        self.scaler = None
        self.loaded = False
    
    def load_models(self):
        """Load all trained ML models"""
        if self.loaded:
            return
        
        try:
            models_path = current_app.config['ML_MODELS_PATH']
            
            # Load scaler
            scaler_path = os.path.join(models_path, 'scaler.pkl')
            if os.path.exists(scaler_path):
                self.scaler = joblib.load(scaler_path)
            else:
                raise FileNotFoundError("Scaler not found. Please train models first.")
            
            # Load models for each condition and algorithm
            conditions = ['diabetes', 'heart', 'obesity']
            algorithms = ['lr', 'dt', 'rf']
            
            for condition in conditions:
                self.models[condition] = {}
                for algo in algorithms:
                    model_path = os.path.join(models_path, f'{condition}_{algo}.pkl')
                    if os.path.exists(model_path):
                        self.models[condition][algo] = joblib.load(model_path)
                    else:
                        print(f"Warning: Model {condition}_{algo} not found")
            
            self.loaded = True
            print("✓ ML models loaded successfully")
            
        except Exception as e:
            print(f"Error loading ML models: {str(e)}")
            raise
    
    def prepare_features(self, health_record, user):
        """
        Prepare features from health record for prediction
        Features: age, bmi, bp_systolic, bp_diastolic, blood_sugar
        """
        features = np.array([[
            user.age if user.age else 30,  # Default age if not provided
            health_record.bmi,
            health_record.blood_pressure_systolic,
            health_record.blood_pressure_diastolic,
            health_record.blood_sugar
        ]])
        
        # Scale features
        if self.scaler:
            features = self.scaler.transform(features)
        
        return features
    
    def predict_single_condition(self, features, condition):
        """
        Predict risk for a single condition using all algorithms
        Returns best prediction and model name
        """
        if condition not in self.models:
            raise ValueError(f"No models found for condition: {condition}")
        
        predictions = {}
        
        for algo_name, model in self.models[condition].items():
            # Get probability of positive class
            prob = model.predict_proba(features)[0][1]
            predictions[algo_name] = prob
        
        # Select best model (Random Forest preferred, then Logistic Regression, then Decision Tree)
        if 'rf' in predictions:
            best_model = 'rf'
            best_prediction = predictions['rf']
        elif 'lr' in predictions:
            best_model = 'lr'
            best_prediction = predictions['lr']
        else:
            best_model = 'dt'
            best_prediction = predictions['dt']
        
        return best_prediction, best_model, predictions
    
    def predict_all_risks(self, health_record, user):
        """
        Predict all health risks (diabetes, heart disease, obesity)
        Returns dictionary with predictions and model information
        """
        if not self.loaded:
            self.load_models()
        
        features = self.prepare_features(health_record, user)
        
        results = {
            'diabetes': {},
            'heart_disease': {},
            'obesity': {},
            'models_used': {}
        }
        
        # Predict diabetes risk
        diabetes_risk, diabetes_model, diabetes_all = self.predict_single_condition(features, 'diabetes')
        results['diabetes'] = {
            'risk': float(diabetes_risk),
            'percentage': round(float(diabetes_risk) * 100, 2)
        }
        results['models_used']['diabetes'] = diabetes_model
        
        # Predict heart disease risk
        heart_risk, heart_model, heart_all = self.predict_single_condition(features, 'heart')
        results['heart_disease'] = {
            'risk': float(heart_risk),
            'percentage': round(float(heart_risk) * 100, 2)
        }
        results['models_used']['heart_disease'] = heart_model
        
        # Predict obesity risk
        obesity_risk, obesity_model, obesity_all = self.predict_single_condition(features, 'obesity')
        results['obesity'] = {
            'risk': float(obesity_risk),
            'percentage': round(float(obesity_risk) * 100, 2)
        }
        results['models_used']['obesity'] = obesity_model
        
        return results

# Global ML service instance
ml_service = MLService()
