from datetime import datetime
from app import db

class HealthRecord(db.Model):
    """Health record model for storing user health data"""
    __tablename__ = 'health_records'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Physical measurements
    height = db.Column(db.Float, nullable=False)  # in cm
    weight = db.Column(db.Float, nullable=False)  # in kg
    bmi = db.Column(db.Float, nullable=False)  # calculated automatically
    
    # Vital signs
    blood_pressure_systolic = db.Column(db.Integer, nullable=False)  # mmHg
    blood_pressure_diastolic = db.Column(db.Integer, nullable=False)  # mmHg
    blood_sugar = db.Column(db.Float, nullable=False)  # mg/dL
    
    # Lifestyle (optional)
    lifestyle_habits = db.Column(db.Text, nullable=True)  # JSON string
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    predictions = db.relationship('Prediction', backref='health_record', lazy=True, cascade='all, delete-orphan')
    
    @staticmethod
    def calculate_bmi(weight, height):
        """Calculate BMI from weight (kg) and height (cm)"""
        height_m = height / 100  # convert cm to meters
        return round(weight / (height_m ** 2), 2)
    
    def to_dict(self):
        """Convert health record to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'height': self.height,
            'weight': self.weight,
            'bmi': self.bmi,
            'blood_pressure': {
                'systolic': self.blood_pressure_systolic,
                'diastolic': self.blood_pressure_diastolic
            },
            'blood_sugar': self.blood_sugar,
            'lifestyle_habits': self.lifestyle_habits,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<HealthRecord {self.id} for User {self.user_id}>'
