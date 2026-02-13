from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User

def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Authentication required', 'message': str(e)}), 401
    return decorated_function

def get_current_user():
    """Get current authenticated user from JWT token"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        return user
    except Exception:
        return None
