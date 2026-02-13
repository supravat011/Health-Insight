from datetime import datetime
from app import db
import json

class Prediction(db.Model):
    """Prediction model for storing ML prediction results"""
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    health_record_id = db.Column(db.Integer, db.ForeignKey('health_records.id'), nullable=False)
    
    # Disease risk predictions (0-1 probability)
    diabetes_risk = db.Column(db.Float, nullable=False)
    heart_disease_risk = db.Column(db.Float, nullable=False)
    obesity_risk = db.Column(db.Float, nullable=False)
    
    # Overall risk assessment
    overall_risk_score = db.Column(db.Float, nullable=False)  # 0-100
    risk_category = db.Column(db.String(20), nullable=False)  # Low, Medium, High
    
    # Recommendations (stored as JSON)
    recommendations = db.Column(db.Text, nullable=True)
    
    # Model information
    models_used = db.Column(db.Text, nullable=True)  # JSON string with model names
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_recommendations(self, recommendations_dict):
        """Store recommendations as JSON string"""
        self.recommendations = json.dumps(recommendations_dict)
    
    def get_recommendations(self):
        """Parse recommendations from JSON string"""
        if self.recommendations:
            return json.loads(self.recommendations)
        return None
    
    def set_models_used(self, models_dict):
        """Store model information as JSON string"""
        self.models_used = json.dumps(models_dict)
    
    def get_models_used(self):
        """Parse model information from JSON string"""
        if self.models_used:
            return json.loads(self.models_used)
        return None
    
    def to_dict(self):
        """Convert prediction to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'health_record_id': self.health_record_id,
            'risks': {
                'diabetes': round(self.diabetes_risk * 100, 2),
                'heart_disease': round(self.heart_disease_risk * 100, 2),
                'obesity': round(self.obesity_risk * 100, 2)
            },
            'overall_risk_score': self.overall_risk_score,
            'risk_category': self.risk_category,
            'recommendations': self.get_recommendations(),
            'models_used': self.get_models_used(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Prediction {self.id} - {self.risk_category} Risk>'
