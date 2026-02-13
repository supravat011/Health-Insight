class RecommendationEngine:
    """Rule-based health recommendation system"""
    
    @staticmethod
    def generate_recommendations(diabetes_risk, heart_risk, obesity_risk, bmi, risk_category):
        """
        Generate personalized health recommendations
        Returns structured recommendations by category
        """
        recommendations = {
            'diet': [],
            'exercise': [],
            'lifestyle': [],
            'medical': []
        }
        
        # Diet recommendations
        recommendations['diet'].extend(RecommendationEngine._get_diet_recommendations(
            diabetes_risk, obesity_risk, bmi
        ))
        
        # Exercise recommendations
        recommendations['exercise'].extend(RecommendationEngine._get_exercise_recommendations(
            heart_risk, bmi, risk_category
        ))
        
        # Lifestyle recommendations
        recommendations['lifestyle'].extend(RecommendationEngine._get_lifestyle_recommendations(
            risk_category, diabetes_risk, heart_risk
        ))
        
        # Medical recommendations
        recommendations['medical'].extend(RecommendationEngine._get_medical_recommendations(
            risk_category, diabetes_risk, heart_risk, obesity_risk
        ))
        
        return recommendations
    
    @staticmethod
    def _get_diet_recommendations(diabetes_risk, obesity_risk, bmi):
        """Generate diet-specific recommendations"""
        recommendations = []
        
        # Diabetes-related diet
        if diabetes_risk > 0.6:
            recommendations.append("Limit refined carbohydrates and sugary foods")
            recommendations.append("Choose whole grains over white bread and rice")
            recommendations.append("Include fiber-rich foods in every meal")
        elif diabetes_risk > 0.3:
            recommendations.append("Monitor carbohydrate intake")
            recommendations.append("Opt for low glycemic index foods")
        
        # Obesity/BMI-related diet
        if obesity_risk > 0.6 or bmi > 30:
            recommendations.append("Reduce portion sizes gradually")
            recommendations.append("Increase vegetable and fruit intake")
            recommendations.append("Limit processed and high-calorie foods")
            recommendations.append("Stay hydrated with water instead of sugary drinks")
        elif bmi > 25:
            recommendations.append("Maintain balanced meals with proper portions")
            recommendations.append("Include lean proteins in your diet")
        
        # General healthy diet
        if not recommendations:
            recommendations.append("Maintain a balanced diet with variety")
            recommendations.append("Include fruits and vegetables daily")
        
        return recommendations
    
    @staticmethod
    def _get_exercise_recommendations(heart_risk, bmi, risk_category):
        """Generate exercise-specific recommendations"""
        recommendations = []
        
        # Heart disease-related exercise
        if heart_risk > 0.6:
            recommendations.append("Start with light cardio exercises (walking, swimming)")
            recommendations.append("Aim for 30 minutes of moderate activity, 5 days a week")
            recommendations.append("Consult a doctor before starting intense workouts")
        elif heart_risk > 0.3:
            recommendations.append("Include regular cardiovascular exercises")
            recommendations.append("Try brisk walking or cycling")
        
        # BMI-related exercise
        if bmi > 30:
            recommendations.append("Begin with low-impact exercises to protect joints")
            recommendations.append("Gradually increase exercise intensity over time")
        elif bmi > 25:
            recommendations.append("Combine cardio with strength training")
            recommendations.append("Aim for 150 minutes of moderate activity per week")
        
        # General fitness
        if risk_category == 'Low':
            recommendations.append("Maintain regular physical activity")
            recommendations.append("Try varied exercises to stay motivated")
        
        if not recommendations:
            recommendations.append("Stay active with regular exercise")
        
        return recommendations
    
    @staticmethod
    def _get_lifestyle_recommendations(risk_category, diabetes_risk, heart_risk):
        """Generate lifestyle-specific recommendations"""
        recommendations = []
        
        if risk_category == 'High':
            recommendations.append("Prioritize stress management techniques")
            recommendations.append("Ensure 7-8 hours of quality sleep nightly")
            recommendations.append("Avoid smoking and limit alcohol consumption")
            recommendations.append("Monitor health metrics regularly")
        elif risk_category == 'Medium':
            recommendations.append("Practice stress reduction (meditation, yoga)")
            recommendations.append("Maintain consistent sleep schedule")
            recommendations.append("Limit alcohol and avoid tobacco")
        else:
            recommendations.append("Continue healthy lifestyle habits")
            recommendations.append("Get adequate sleep and manage stress")
        
        # Specific lifestyle changes
        if diabetes_risk > 0.5:
            recommendations.append("Monitor blood sugar levels regularly")
        
        if heart_risk > 0.5:
            recommendations.append("Monitor blood pressure regularly")
            recommendations.append("Reduce sodium intake")
        
        return recommendations
    
    @staticmethod
    def _get_medical_recommendations(risk_category, diabetes_risk, heart_risk, obesity_risk):
        """Generate medical consultation recommendations"""
        recommendations = []
        
        if risk_category == 'High':
            recommendations.append("Schedule a comprehensive health checkup immediately")
            recommendations.append("Consult with a healthcare provider about your risk factors")
        
        if diabetes_risk > 0.7:
            recommendations.append("Get HbA1c test to check long-term blood sugar levels")
            recommendations.append("Consider consulting an endocrinologist")
        
        if heart_risk > 0.7:
            recommendations.append("Schedule a cardiovascular assessment")
            recommendations.append("Discuss cholesterol and blood pressure management with your doctor")
        
        if obesity_risk > 0.7:
            recommendations.append("Consult a nutritionist for personalized diet plan")
            recommendations.append("Consider medical weight management options")
        
        if risk_category == 'Medium':
            recommendations.append("Schedule regular health checkups")
        
        if not recommendations:
            recommendations.append("Maintain annual health checkups")
        
        return recommendations

# Global recommendation engine instance
recommendation_engine = RecommendationEngine()
