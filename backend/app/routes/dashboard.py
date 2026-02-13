from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.prediction import Prediction
from app.models.health_record import HealthRecord
from sqlalchemy import func

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get summary statistics for user dashboard"""
    try:
        user_id = get_jwt_identity()
        
        # Get latest prediction
        latest_prediction = Prediction.query.filter_by(user_id=user_id).order_by(
            Prediction.created_at.desc()
        ).first()
        
        # Get total health records
        total_records = HealthRecord.query.filter_by(user_id=user_id).count()
        
        # Get total predictions
        total_predictions = Prediction.query.filter_by(user_id=user_id).count()
        
        # Calculate risk trend (compare last 2 predictions)
        predictions = Prediction.query.filter_by(user_id=user_id).order_by(
            Prediction.created_at.desc()
        ).limit(2).all()
        
        risk_trend = None
        if len(predictions) >= 2:
            current_risk = predictions[0].overall_risk_score
            previous_risk = predictions[1].overall_risk_score
            
            if current_risk < previous_risk:
                risk_trend = 'improving'
            elif current_risk > previous_risk:
                risk_trend = 'worsening'
            else:
                risk_trend = 'stable'
        
        # Get average BMI
        avg_bmi = db.session.query(func.avg(HealthRecord.bmi)).filter_by(user_id=user_id).scalar()
        
        return jsonify({
            'latest_prediction': latest_prediction.to_dict() if latest_prediction else None,
            'total_health_records': total_records,
            'total_predictions': total_predictions,
            'risk_trend': risk_trend,
            'average_bmi': round(float(avg_bmi), 2) if avg_bmi else None,
            'has_data': total_records > 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard stats', 'message': str(e)}), 500

@bp.route('/timeline', methods=['GET'])
@jwt_required()
def get_timeline():
    """Get prediction timeline data for charts"""
    try:
        user_id = get_jwt_identity()
        
        # Get all predictions with health records
        predictions = Prediction.query.filter_by(user_id=user_id).order_by(
            Prediction.created_at.desc()
        ).all()
        
        timeline_data = []
        prev_risk = None
        
        for i, prediction in enumerate(predictions):
            health_record = HealthRecord.query.get(prediction.health_record_id)
            
            # Calculate trend
            trend = None
            if prev_risk is not None:
                if prediction.overall_risk_score < prev_risk:
                    trend = 'improving'
                elif prediction.overall_risk_score > prev_risk:
                    trend = 'worsening'
                else:
                    trend = 'stable'
            
            timeline_data.append({
                'id': prediction.id,
                'date': prediction.created_at.isoformat(),
                'overall_risk_score': prediction.overall_risk_score,
                'risk_category': prediction.risk_category,
                'risks': {
                    'diabetes': round(prediction.diabetes_risk * 100, 2),
                    'heart_disease': round(prediction.heart_disease_risk * 100, 2),
                    'obesity': round(prediction.obesity_risk * 100, 2)
                },
                'trend': trend,
                'bmi': health_record.bmi if health_record else None
            })
            
            prev_risk = prediction.overall_risk_score
        
        return jsonify({
            'timeline': timeline_data,
            'total_points': len(timeline_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch timeline data', 'message': str(e)}), 500
