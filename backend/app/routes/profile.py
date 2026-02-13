from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.health_record import HealthRecord
from app.utils.validators import validate_age, validate_gender

bp = Blueprint('profile', __name__, url_prefix='/api/profile')

@bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user's profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch profile', 'message': str(e)}), 500

@bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Update user profile
    Expected JSON: {name (optional), age (optional), gender (optional)}
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update name if provided
        if 'name' in data and data['name']:
            user.name = data['name'].strip()
        
        # Update age if provided
        if 'age' in data:
            if data['age'] is not None:
                is_valid, message = validate_age(data['age'])
                if not is_valid:
                    return jsonify({'error': message}), 400
            user.age = data['age']
        
        # Update gender if provided
        if 'gender' in data:
            if data['gender'] is not None:
                is_valid, message = validate_gender(data['gender'])
                if not is_valid:
                    return jsonify({'error': message}), 400
                user.gender = data['gender'].lower()
            else:
                user.gender = None
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile', 'message': str(e)}), 500

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_health_history():
    """Get user's health history (health records and predictions)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get health records
        health_records = HealthRecord.query.filter_by(user_id=user_id).order_by(HealthRecord.created_at.desc()).all()
        
        return jsonify({
            'health_records': [record.to_dict() for record in health_records],
            'total_records': len(health_records)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch health history', 'message': str(e)}), 500
