class RiskScorer:
    """Health risk scoring and classification service"""
    
    @staticmethod
    def calculate_overall_risk_score(diabetes_risk, heart_risk, obesity_risk, bmi):
        """
        Calculate overall health risk score (0-100)
        Weighted combination of ML predictions and BMI
        """
        # Weights for different risk factors
        diabetes_weight = 0.3
        heart_weight = 0.35
        obesity_weight = 0.25
        bmi_weight = 0.1
        
        # Calculate BMI risk component (normalized to 0-1)
        bmi_risk = RiskScorer._calculate_bmi_risk(bmi)
        
        # Weighted sum
        overall_risk = (
            diabetes_risk * diabetes_weight +
            heart_risk * heart_weight +
            obesity_risk * obesity_weight +
            bmi_risk * bmi_weight
        )
        
        # Convert to 0-100 scale
        risk_score = round(overall_risk * 100, 2)
        
        return risk_score
    
    @staticmethod
    def _calculate_bmi_risk(bmi):
        """Calculate risk component from BMI (0-1 scale)"""
        if bmi < 18.5:
            # Underweight
            return 0.3
        elif 18.5 <= bmi < 25:
            # Normal weight
            return 0.1
        elif 25 <= bmi < 30:
            # Overweight
            return 0.5
        else:
            # Obese
            return 0.8
    
    @staticmethod
    def classify_risk(risk_score):
        """
        Classify risk score into categories
        Low: 0-30, Medium: 30-60, High: 60-100
        """
        if risk_score < 30:
            return 'Low'
        elif risk_score < 60:
            return 'Medium'
        else:
            return 'High'
    
    @staticmethod
    def generate_risk_explanation(risk_category, diabetes_risk, heart_risk, obesity_risk, bmi):
        """Generate human-readable risk explanation"""
        explanations = []
        
        # Overall risk
        if risk_category == 'Low':
            explanations.append("Your overall health risk is low. Keep maintaining healthy habits!")
        elif risk_category == 'Medium':
            explanations.append("Your health risk is moderate. Consider making some lifestyle improvements.")
        else:
            explanations.append("Your health risk is high. Please consult a healthcare professional.")
        
        # Specific risks
        if diabetes_risk > 0.6:
            explanations.append("High diabetes risk detected. Monitor blood sugar levels closely.")
        
        if heart_risk > 0.6:
            explanations.append("Elevated heart disease risk. Consider cardiovascular health improvements.")
        
        if obesity_risk > 0.6 or bmi > 30:
            explanations.append("Obesity risk is concerning. Weight management is recommended.")
        
        # BMI-specific
        if bmi < 18.5:
            explanations.append("Your BMI indicates underweight. Consider consulting a nutritionist.")
        elif bmi >= 25 and bmi < 30:
            explanations.append("Your BMI indicates overweight. Gradual weight loss may be beneficial.")
        elif bmi >= 30:
            explanations.append("Your BMI indicates obesity. Medical guidance for weight management is advised.")
        
        return " ".join(explanations)

# Global risk scorer instance
risk_scorer = RiskScorer()
