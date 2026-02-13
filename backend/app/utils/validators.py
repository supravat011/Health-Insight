import re

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """
    Validate password strength
    Requirements: At least 6 characters
    """
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    return True, "Valid password"

def validate_age(age):
    """Validate age is within reasonable range"""
    if age is None:
        return True, "Age is optional"
    if not isinstance(age, int) or age < 1 or age > 120:
        return False, "Age must be between 1 and 120"
    return True, "Valid age"

def validate_height(height):
    """Validate height in cm (50-250 cm)"""
    if not isinstance(height, (int, float)) or height < 50 or height > 250:
        return False, "Height must be between 50 and 250 cm"
    return True, "Valid height"

def validate_weight(weight):
    """Validate weight in kg (20-300 kg)"""
    if not isinstance(weight, (int, float)) or weight < 20 or weight > 300:
        return False, "Weight must be between 20 and 300 kg"
    return True, "Valid weight"

def validate_blood_pressure(systolic, diastolic):
    """Validate blood pressure values"""
    if not isinstance(systolic, int) or systolic < 70 or systolic > 200:
        return False, "Systolic BP must be between 70 and 200 mmHg"
    if not isinstance(diastolic, int) or diastolic < 40 or diastolic > 130:
        return False, "Diastolic BP must be between 40 and 130 mmHg"
    if systolic <= diastolic:
        return False, "Systolic BP must be greater than diastolic BP"
    return True, "Valid blood pressure"

def validate_blood_sugar(blood_sugar):
    """Validate blood sugar level in mg/dL (40-400)"""
    if not isinstance(blood_sugar, (int, float)) or blood_sugar < 40 or blood_sugar > 400:
        return False, "Blood sugar must be between 40 and 400 mg/dL"
    return True, "Valid blood sugar"

def validate_gender(gender):
    """Validate gender value"""
    if gender is None:
        return True, "Gender is optional"
    valid_genders = ['male', 'female', 'other']
    if gender.lower() not in valid_genders:
        return False, f"Gender must be one of: {', '.join(valid_genders)}"
    return True, "Valid gender"
