from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User
from app.utils.validators import validate_email, validate_password, validate_age, validate_gender

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    """
    User registration endpoint
    Expected JSON: {email, password, name, age (optional), gender (optional)}
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not all(k in data for k in ['email', 'password', 'name']):
            return jsonify({'error': 'Missing required fields: email, password, name'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        name = data['name'].strip()
        age = data.get('age')
        gender = data.get('gender')
        
        # Validate email
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Validate password
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Validate age if provided
        if age is not None:
            is_valid, message = validate_age(age)
            if not is_valid:
                return jsonify({'error': message}), 400
        
        # Validate gender if provided
        if gender is not None:
            is_valid, message = validate_gender(gender)
            if not is_valid:
                return jsonify({'error': message}), 400
            gender = gender.lower()
        
        # Create new user
        user = User(email=email, name=name, age=age, gender=gender)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'message': str(e)}), 500

@bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint
    Expected JSON: {email, password}
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not all(k in data for k in ['email', 'password']):
            return jsonify({'error': 'Missing required fields: email, password'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # Verify user exists and password is correct
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

@bp.route('/logout', methods=['POST'])
def logout():
    """
    User logout endpoint
    Note: JWT tokens are stateless, so logout is handled client-side by removing the token
    """
    return jsonify({'message': 'Logout successful. Please remove the token from client storage.'}), 200
