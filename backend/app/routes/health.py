from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.health_record import HealthRecord
from app.utils.validators import (
    validate_height, validate_weight, validate_blood_pressure, validate_blood_sugar
)

bp = Blueprint('health', __name__, url_prefix='/api/health')

@bp.route('/record', methods=['POST'])
@jwt_required()
def create_health_record():
    """
    Create new health record with automatic BMI calculation
    Expected JSON: {height, weight, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar, lifestyle_habits (optional)}
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['height', 'weight', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'blood_sugar']
        if not data or not all(k in data for k in required_fields):
            return jsonify({'error': f'Missing required fields: {", ".join(required_fields)}'}), 400
        
        height = data['height']
        weight = data['weight']
        bp_systolic = data['blood_pressure_systolic']
        bp_diastolic = data['blood_pressure_diastolic']
        blood_sugar = data['blood_sugar']
        lifestyle_habits = data.get('lifestyle_habits')
        
        # Validate height
        is_valid, message = validate_height(height)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Validate weight
        is_valid, message = validate_weight(weight)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Validate blood pressure
        is_valid, message = validate_blood_pressure(bp_systolic, bp_diastolic)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Validate blood sugar
        is_valid, message = validate_blood_sugar(blood_sugar)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Calculate BMI
        bmi = HealthRecord.calculate_bmi(weight, height)
        
        # Create health record
        health_record = HealthRecord(
            user_id=user_id,
            height=height,
            weight=weight,
            bmi=bmi,
            blood_pressure_systolic=bp_systolic,
            blood_pressure_diastolic=bp_diastolic,
            blood_sugar=blood_sugar,
            lifestyle_habits=lifestyle_habits
        )
        
        db.session.add(health_record)
        db.session.commit()
        
        return jsonify({
            'message': 'Health record created successfully',
            'health_record': health_record.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create health record', 'message': str(e)}), 500

@bp.route('/records', methods=['GET'])
@jwt_required()
def get_health_records():
    """Get all health records for current user"""
    try:
        user_id = get_jwt_identity()
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Query health records with pagination
        pagination = HealthRecord.query.filter_by(user_id=user_id).order_by(
            HealthRecord.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'health_records': [record.to_dict() for record in pagination.items],
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'total_pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch health records', 'message': str(e)}), 500

@bp.route('/record/<int:record_id>', methods=['GET'])
@jwt_required()
def get_health_record(record_id):
    """Get specific health record"""
    try:
        user_id = get_jwt_identity()
        
        health_record = HealthRecord.query.filter_by(id=record_id, user_id=user_id).first()
        
        if not health_record:
            return jsonify({'error': 'Health record not found'}), 404
        
        return jsonify({
            'health_record': health_record.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch health record', 'message': str(e)}), 500
