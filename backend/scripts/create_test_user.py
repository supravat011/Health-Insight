"""
Script to create a test user for development purposes
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db, bcrypt
from app.models.user import User

def create_test_user():
    app = create_app()
    
    with app.app_context():
        # Test user credentials
        email = "test@example.com"
        password = "password123"
        name = "Test User"
        age = 30
        gender = "male"
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        
        if existing_user:
            print(f"✅ Test user already exists!")
            print(f"\n📧 Email: {email}")
            print(f"🔑 Password: {password}")
            print(f"👤 Name: {existing_user.name}")
            return
        
        # Create new user
        new_user = User(
            email=email,
            name=name,
            age=age,
            gender=gender
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        print(f"✅ Test user created successfully!")
        print(f"\n📧 Email: {email}")
        print(f"🔑 Password: {password}")
        print(f"👤 Name: {name}")
        print(f"🎂 Age: {age}")
        print(f"⚧ Gender: {gender}")

if __name__ == "__main__":
    create_test_user()
