from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.health_record import HealthRecord
from app.models.prediction import Prediction
from app.services.ml_service import ml_service
from app.services.risk_scorer import risk_scorer
from app.services.recommendation_engine import recommendation_engine

bp = Blueprint('prediction', __name__, url_prefix='/api')

@bp.route('/predict', methods=['POST'])
@jwt_required()
def create_prediction():
    """
    Generate health risk prediction from health record
    Expected JSON: {health_record_id}
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not data or 'health_record_id' not in data:
            return jsonify({'error': 'Missing required field: health_record_id'}), 400
        
        health_record_id = data['health_record_id']
        
        # Get health record
        health_record = HealthRecord.query.filter_by(
            id=health_record_id, 
            user_id=user_id
        ).first()
        
        if not health_record:
            return jsonify({'error': 'Health record not found'}), 404
        
        # Load ML models if not already loaded
        try:
            ml_service.load_models()
        except Exception as e:
            return jsonify({
                'error': 'ML models not available',
                'message': 'Please train the models first by running: python scripts/train_models.py',
                'details': str(e)
            }), 503
        
        # Get ML predictions
        ml_results = ml_service.predict_all_risks(health_record, user)
        
        diabetes_risk = ml_results['diabetes']['risk']
        heart_risk = ml_results['heart_disease']['risk']
        obesity_risk = ml_results['obesity']['risk']
        
        # Calculate overall risk score
        overall_risk_score = risk_scorer.calculate_overall_risk_score(
            diabetes_risk, heart_risk, obesity_risk, health_record.bmi
        )
        
        # Classify risk
        risk_category = risk_scorer.classify_risk(overall_risk_score)
        
        # Generate recommendations
        recommendations = recommendation_engine.generate_recommendations(
            diabetes_risk, heart_risk, obesity_risk, health_record.bmi, risk_category
        )
        
        # Create prediction record
        prediction = Prediction(
            user_id=user_id,
            health_record_id=health_record_id,
            diabetes_risk=diabetes_risk,
            heart_disease_risk=heart_risk,
            obesity_risk=obesity_risk,
            overall_risk_score=overall_risk_score,
            risk_category=risk_category
        )
        
        prediction.set_recommendations(recommendations)
        prediction.set_models_used(ml_results['models_used'])
        
        db.session.add(prediction)
        db.session.commit()
        
        # Generate risk explanation
        explanation = risk_scorer.generate_risk_explanation(
            risk_category, diabetes_risk, heart_risk, obesity_risk, health_record.bmi
        )
        
        return jsonify({
            'message': 'Prediction generated successfully',
            'prediction': prediction.to_dict(),
            'explanation': explanation,
            'disclaimer': 'This prediction is for informational purposes only and should not replace professional medical advice.'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to generate prediction', 'message': str(e)}), 500

@bp.route('/predictions', methods=['GET'])
@jwt_required()
def get_predictions():
    """Get user's prediction history"""
    try:
        user_id = get_jwt_identity()
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Query predictions with pagination
        pagination = Prediction.query.filter_by(user_id=user_id).order_by(
            Prediction.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'predictions': [pred.to_dict() for pred in pagination.items],
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'total_pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch predictions', 'message': str(e)}), 500

@bp.route('/prediction/<int:prediction_id>', methods=['GET'])
@jwt_required()
def get_prediction(prediction_id):
    """Get specific prediction result"""
    try:
        user_id = get_jwt_identity()
        
        prediction = Prediction.query.filter_by(id=prediction_id, user_id=user_id).first()
        
        if not prediction:
            return jsonify({'error': 'Prediction not found'}), 404
        
        # Get associated health record
        health_record = HealthRecord.query.get(prediction.health_record_id)
        
        return jsonify({
            'prediction': prediction.to_dict(),
            'health_record': health_record.to_dict() if health_record else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch prediction', 'message': str(e)}), 500
