from flask import Blueprint, request, jsonify
import logging
from decouple import config
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from flask import current_app as app
import jwt
import random
import string
from werkzeug.security import generate_password_hash

signup_bp = Blueprint('signup', __name__, url_prefix='/api/signup')
logger = logging.getLogger(__name__)

def generate_verification_code(length=6):
    """Generate a random 6-digit verification code."""
    return ''.join(random.choices(string.digits, k=length))

def send_verification_email(email, code):
    """Send a verification code to the user's email."""
    sender_email = app.config['SENDER_EMAIL']
    sender_password = app.config['SENDER_PASSWORD']
    smtp_server = app.config['SMTP_SERVER']
    smtp_port = app.config['SMTP_PORT']

    msg = MIMEText(f"Your verification code is {code}. It expires in 10 minutes.")
    msg['Subject'] = "Email Verification Code"
    msg['From'] = sender_email
    msg['To'] = email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())
        logger.info(f"Verification code {code} sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send verification email to {email}: {str(e)}")
        return False

@signup_bp.route('/send-verification', methods=['POST'])
def send_verification():
    """Send a verification code to the user's email."""
    data = request.get_json()
    email = data.get('email')
    user_type = data.get('userType', 'customer')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Check if email already exists
    if app.mongo.db.users.find_one({"email": email}) or app.mongo.db.verification_codes.find_one({"email": email, "expires_at": {"$gt": datetime.utcnow()}}):
        return jsonify({"error": "Email already registered or verification in progress"}), 400

    # Generate and store verification code
    code = generate_verification_code()
    app.mongo.db.verification_codes.insert_one({
        "email": email,
        "code": code,
        "user_type": user_type,
        "expires_at": datetime.utcnow() + timedelta(minutes=10),
        "created_at": datetime.utcnow()
    })

    # Send verification email
    if send_verification_email(email, code):
        return jsonify({"message": "Verification code sent", "email": email}), 200
    return jsonify({"error": "Failed to send verification code"}), 500

@signup_bp.route('/verify', methods=['POST'])
def verify():
    """Verify the user's email with the provided code."""
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"error": "Email and code are required"}), 400

    verification = app.mongo.db.verification_codes.find_one({
        "email": email,
        "code": code,
        "expires_at": {"$gt": datetime.utcnow()}
    })

    if verification:
        app.mongo.db.verification_codes.delete_one({"_id": verification["_id"]})
        return jsonify({"message": "Email verified successfully", "email": email, "user_type": verification["user_type"]}), 200
    return jsonify({"error": "Invalid or expired verification code"}), 400

@signup_bp.route('/register', methods=['POST'])
def signup():
    """Register a new user after email verification."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('userType')
    full_name = data.get('fullName')
    company_name = data.get('companyName')
    company_reg_number = data.get('companyRegNumber')

    if not email or not password or not user_type:
        return jsonify({"error": "Email, password, and user type are required"}), 400

    # Check if email is already registered
    if app.mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    # Verify email (ensure verification has been completed)
    verification = app.mongo.db.verification_codes.find_one({"email": email, "expires_at": {"$gt": datetime.utcnow()}})
    if not verification:
        return jsonify({"error": "Email not verified. Please verify your email first"}), 400

    # Validate user-specific fields
    if user_type == "customer" and not full_name:
        return jsonify({"error": "Full name is required for customer accounts"}), 400
    elif user_type == "company" and (not company_name or not company_reg_number):
        return jsonify({"error": "Company name and registration number are required for company accounts"}), 400

    # Hash password and create user data
    hashed_password = generate_password_hash(password)
    user_data = {
        "email": email,
        "password": hashed_password,
        "user_type": user_type,
        "full_name": full_name if user_type == "customer" else None,
        "company_name": company_name if user_type == "company" else None,
        "company_reg_number": company_reg_number if user_type == "company" else None,
        "prominenceScore": 0,
        "customerCategory": "Standard" if user_type == "customer" else None,
        "activities": [],
        "age": 30 if user_type == "customer" else None,
        "annualIncome": 0 if user_type == "customer" else None,
        "dependents": 0 if user_type == "customer" else None,
        "riskTolerance": 50 if user_type == "customer" else None,
        "creditScore": 300 if user_type == "customer" else None,
        "created_at": datetime.utcnow()
    }

    # Insert user into MongoDB
    app.mongo.db.users.insert_one(user_data)
    app.mongo.db.verification_codes.delete_many({"email": email})  # Clean up verification records
    logger.info(f"User registered successfully: {email}")

    # Generate and return JWT token
    token_payload = {"email": email, "user_type": user_type, "exp": datetime.utcnow() + timedelta(hours=1)}
    token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({"token": token, "user": {k: v for k, v in user_data.items() if k != "password"}}), 201