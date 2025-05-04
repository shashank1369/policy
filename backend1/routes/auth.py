from flask import Blueprint, request, jsonify
import logging
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from flask import current_app as app
from bson.objectid import ObjectId
import numpy as np
from typing import Dict, Any, List
from tensorflow.keras.models import load_model
import joblib
import os
import pandas as pd
import json
import random
import string

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
logger = logging.getLogger(__name__)

# Define model and scaler file paths with absolute path
MODEL_DIR = "C:/Users/shash/OneDrive/Desktop/policy/backend1/model"
ANN_MODEL_PATH = os.path.join(MODEL_DIR, "ann_prominence_model.keras")
RNN_MODEL_PATH = os.path.join(MODEL_DIR, "rnn_policy_model.keras")  # Note: Not used yet
SCALER_PROMINENCE_PATH = os.path.join(MODEL_DIR, "scaler_prominence.joblib")
SCALER_POLICY_PATH = os.path.join(MODEL_DIR, "scaler_policy.joblib")

# Load dataset path from .env
DATASET_PATH = os.getenv("DATASET_PATH", r"C:\Users\shash\OneDrive\Desktop\policy\backend1\insurance_plans_data.csv")
INSURANCE_DATA_FILE = os.path.join(DATASET_PATH, "insurance_plans_data.csv")

# Load models and scalers at module level with validation
try:
    logger.info(f"Checking file: {ANN_MODEL_PATH}")
    if not os.path.exists(ANN_MODEL_PATH):
        raise FileNotFoundError(f"File not found at {ANN_MODEL_PATH}")
    ANN_MODEL = load_model(ANN_MODEL_PATH)
    logger.info(f"Checking file: {RNN_MODEL_PATH}")
    if not os.path.exists(RNN_MODEL_PATH):
        logger.warning(f"File not found at {RNN_MODEL_PATH}, RNN model will not be used")
    else:
        RNN_MODEL = load_model(RNN_MODEL_PATH)
    logger.info(f"Checking file: {SCALER_PROMINENCE_PATH}")
    if not os.path.exists(SCALER_PROMINENCE_PATH):
        raise FileNotFoundError(f"File not found at {SCALER_PROMINENCE_PATH}")
    SCALER_PROMINENCE = joblib.load(SCALER_PROMINENCE_PATH)
    logger.info(f"Checking file: {SCALER_POLICY_PATH}")
    if not os.path.exists(SCALER_POLICY_PATH):
        raise FileNotFoundError(f"File not found at {SCALER_POLICY_PATH}")
    SCALER_POLICY = joblib.load(SCALER_POLICY_PATH)
    logger.info(f"Models and scalers loaded from {MODEL_DIR}. SCALER_PROMINENCE expects {SCALER_PROMINENCE.n_features_in_} features.")
except FileNotFoundError as e:
    logger.error(f"Model or scaler file not found: {e}")
    raise
except ValueError as e:
    logger.error(f"Invalid model file format: {e}. Ensure {ANN_MODEL_PATH} is a valid .keras file.")
    raise
except Exception as e:
    logger.error(f"Error loading models or scalers: {str(e)}")
    raise

# Load and preprocess insurance plans data
def load_insurance_data():
    try:
        if not os.path.exists(INSURANCE_DATA_FILE):
            logger.error(f"Insurance data file not found at {INSURANCE_DATA_FILE}")
            return pd.DataFrame()
        df = pd.read_csv(INSURANCE_DATA_FILE)
        logger.info(f"Raw CSV content:\n{df.head().to_string()}")  # Log first few rows for debugging
        if 'type' not in df.columns or 'premium' not in df.columns or 'coverageLimits' not in df.columns:
            logger.error(f"Missing required columns in {INSURANCE_DATA_FILE}. Expected: ['type', 'premium', 'coverageLimits']")
            return pd.DataFrame()
        df = df.dropna(subset=['type', 'premium', 'coverageLimits'])
        df['premium'] = pd.to_numeric(df['premium'], errors='coerce')
        df = df.dropna(subset=['premium'])
        df['coverageLimits'] = df['coverageLimits'].apply(
            lambda x: json.loads(x.replace("'", '"')) if isinstance(x, str) else {}
        )
        logger.info(f"Loaded {len(df)} valid insurance plans from {INSURANCE_DATA_FILE}")
        return df
    except Exception as e:
        logger.error(f"Error loading insurance data: {str(e)}")
        return pd.DataFrame()

INSURANCE_DATA = load_insurance_data()

# Store verification codes (in-memory for simplicity; use a database in production)
verification_codes = {}

def token_required(f):
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        logger.info(f"Received Authorization header: {auth_header}")
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("No or invalid Authorization header")
            return jsonify({"error": "Authorization token required"}), 401
        token = auth_header.split(' ')[1]
        try:
            logger.info(f"Decoding token: {token[:20]}...")
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            email = payload.get("email")
            if not email:
                logger.warning("No email in token payload")
                return jsonify({"error": "Invalid token payload"}), 401
            logger.info(f"Token decoded successfully for email: {email}")
            user = app.mongo.db.users.find_one({"email": email})
            if not user:
                logger.warning(f"User not found for email: {email}")
                return jsonify({"error": "User not found"}), 404
            return f(email, user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token error: {str(e)}")
            return jsonify({"error": "Invalid token format. Please log in again"}), 401
        except Exception as e:
            logger.error(f"Unexpected error decoding token: {str(e)}")
            return jsonify({"error": "Authentication failed"}), 401
    return decorated

@auth_bp.route('/send-verification', methods=['POST'])
def send_verification():
    data = request.get_json()
    email = data.get('email')
    user_type = data.get('userType', 'customer')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    code = ''.join(random.choices(string.digits, k=6))
    verification_codes[email] = code
    logger.info(f"Verification code {code} sent to {email} for {user_type}")
    return jsonify({"message": "Verification code sent successfully"}), 200

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    if not email or not code:
        return jsonify({"error": "Email and code are required"}), 400
    if email in verification_codes and verification_codes[email] == code:
        del verification_codes[email]
        logger.info(f"Email {email} verified successfully")
        return jsonify({"message": "Email verified successfully"}), 200
    return jsonify({"error": "Invalid verification code"}), 400

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('userType')
    full_name = data.get('fullName')
    company_name = data.get('companyName')
    company_reg_number = data.get('companyRegNumber')

    if not email or not password or not user_type:
        return jsonify({"error": "Email, password, and user type are required"}), 400
    if app.mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)
    user_data = {
        "email": email,
        "password": hashed_password,
        "user_type": user_type,
        "full_name": full_name,
        "company_name": company_name,
        "company_reg_number": company_reg_number,
        "created_at": datetime.utcnow(),
        "age": 30,  # Default values
        "annualIncome": 0.0,
        "dependents": 0,
        "riskTolerance": 50,
        "creditScore": 300,
        "insuranceHistory": "poor",
        "claimHistory": "none",
        "prominenceScore": 0,
        "customerCategory": "Standard"
    }
    app.mongo.db.users.insert_one(user_data)
    logger.info(f"Registered new user: {email} as {user_type}")

    token_payload = {
        "email": email,
        "user_type": user_type,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({"token": token, "user": {"email": email, "user_type": user_type, "full_name": full_name, "company_name": company_name}}), 200

@auth_bp.route('/login', methods=['POST'], endpoint='auth_login')
def login():
    try:
        if not hasattr(app, 'mongo') or app.mongo.db is None:
            logger.error("MongoDB connection not available")
            return jsonify({"error": "Database connection failed"}), 500

        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user_type = data.get('userType', 'customer')

        logger.info(f"Login attempt - Email: {email}, UserType: {user_type}")
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        if '@' not in email or '.' not in email.split('@')[1]:
            return jsonify({"error": "Invalid email format"}), 400

        user = app.mongo.db.users.find_one({"email": email})
        if not user:
            logger.warning(f"User not found for email: {email}")
            return jsonify({"error": "User not found"}), 401

        if user_type != user.get('user_type'):
            logger.warning(f"Mismatched user_type: requested {user_type}, found {user.get('user_type')}")
            return jsonify({"error": "Invalid user type"}), 401

        if not check_password_hash(user.get('password', ''), password):
            logger.warning(f"Invalid password for email: {email}")
            return jsonify({"error": "Invalid email or password"}), 401

        token_payload = {
            "email": email,
            "user_type": user.get('user_type'),
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm="HS256")

        app.mongo.db.users.update_one(
            {"email": email},
            {"$push": {"activities": {"type": "login", "timestamp": datetime.utcnow()}}}
        )

        user_data = {
            "email": user.get('email', email),
            "user_type": user.get('user_type', user_type),
            "full_name": user.get('full_name', 'Unknown User'),
            "prominenceScore": user.get('prominenceScore', 0),
            "customerCategory": user.get('customerCategory', 'Standard')
        }
        logger.info(f"Prepared user data for response: {user_data}")

        response_data = {"token": token, "user": user_data}
        logger.info(f"Login response data: {response_data}")
        return jsonify(response_data), 200

    except Exception as e:
        logger.error(f"Error during login for {email}: {str(e)}")
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@auth_bp.route('/user', methods=['GET'], endpoint='auth_user')
@token_required
def get_user(email, user):
    try:
        if not hasattr(app, 'mongo') or app.mongo.db is None:
            logger.error("MongoDB connection not available")
            return jsonify({"error": "Database connection failed"}), 500

        user_data = {
            "email": user.get('email', ''),
            "user_type": user.get('user_type', ''),
            "full_name": user.get('full_name', ''),
            "prominenceScore": user.get('prominenceScore', 0),
            "customerCategory": user.get('customerCategory', 'Standard')
        }
        logger.info(f"User data retrieved for {email}")
        return jsonify(user_data), 200
    except Exception as e:
        logger.error(f"Error retrieving user for {email}: {str(e)}")
        return jsonify({"error": f"Failed to retrieve user: {str(e)}"}), 500

@auth_bp.route('/submit-form', methods=['POST'], endpoint='auth_submit_form')
@token_required
def submit_form(email, user):
    try:
        if user["user_type"] != "customer":
            return jsonify({"error": "Only customers can submit forms"}), 403

        data = request.get_json() or {}
        logger.info(f"Received form data: {data}")

        # Validate and default input data
        age = int(data.get('age', user.get('age', 30))) if str(data.get('age', user.get('age', 30))).isdigit() and int(data.get('age', user.get('age', 30))) > 0 else 30
        annual_income = float(data.get('annualIncome', user.get('annualIncome', 0))) if str(data.get('annualIncome', user.get('annualIncome', 0))).replace('.', '').isdigit() and float(data.get('annualIncome', user.get('annualIncome', 0))) >= 0 else 0.0
        dependents = int(data.get('dependents', user.get('dependents', 0))) if str(data.get('dependents', user.get('dependents', 0))).isdigit() and int(data.get('dependents', user.get('dependents', 0))) >= 0 else 0
        risk_tolerance = int(data.get('riskTolerance', user.get('riskTolerance', 50))) if str(data.get('riskTolerance', user.get('riskTolerance', 50))).isdigit() and 0 <= int(data.get('riskTolerance', user.get('riskTolerance', 50))) <= 100 else 50
        credit_score = int(data.get('creditScore', user.get('creditScore', 300))) if str(data.get('creditScore', user.get('creditScore', 300))).isdigit() and 300 <= int(data.get('creditScore', user.get('creditScore', 300))) <= 900 else 300
        insurance_history = data.get('insuranceHistory', user.get('insuranceHistory', 'poor'))
        claim_history = data.get('claimHistory', user.get('claimHistory', 'none'))
        history_score = {'excellent': 4, 'good': 3, 'average': 2, 'poor': 1, 'yes': 1, 'no': 3, 'several': 1}.get(insurance_history.lower() or claim_history.lower(), 2)

        # Prepare input data for ANN prediction (6 features)
        input_data = np.array([[age, annual_income, dependents, risk_tolerance, credit_score, history_score]])
        logger.info(f"Input data shape before scaling: {input_data.shape}, data: {input_data.tolist()}, features: ['age', 'annual_income', 'dependents', 'risk_tolerance', 'credit_score', 'history_score']")

        if input_data.shape[1] != SCALER_PROMINENCE.n_features_in_:
            logger.error(f"Input data has {input_data.shape[1]} features, but scaler expects {SCALER_PROMINENCE.n_features_in_} features")
            return jsonify({"error": f"Feature mismatch: expected {SCALER_PROMINENCE.n_features_in_} features, got {input_data.shape[1]}. Ensure input matches training data features: ['age', 'annual_income', 'dependents', 'risk_tolerance', 'credit_score', 'history_score']."}), 400

        scaled_input = SCALER_PROMINENCE.transform(input_data)
        logger.info(f"Scaled input: {scaled_input.tolist()}")
        raw_prediction = ANN_MODEL.predict(scaled_input)[0][0]
        logger.info(f"Raw ANN prediction: {raw_prediction}")
        normalized_value = raw_prediction / 100.0 if raw_prediction <= 100 else raw_prediction / np.max([abs(raw_prediction), 1e-10])
        prominence_score = max(0, min(100, round(normalized_value * 100)))
        logger.info(f"Normalized value: {normalized_value}, Capped prominence score: {prominence_score}")
        customer_category = "Elite" if prominence_score >= 70 else "Valuable" if prominence_score >= 40 else "Standard"

        # Update user data in MongoDB
        app.mongo.db.users.update_one(
            {"email": email},
            {"$set": {
                "age": age,
                "annualIncome": annual_income,
                "dependents": dependents,
                "riskTolerance": risk_tolerance,
                "creditScore": credit_score,
                "insuranceHistory": insurance_history,
                "claimHistory": claim_history,
                "prominenceScore": prominence_score,
                "customerCategory": customer_category,
                "lastUpdated": datetime.utcnow()
            }}
        )

        # Calculate income threshold before recommendations
        income_threshold = annual_income * 0.1  # 10% of income as premium cap

        # Generate recommendations based on prominence score and income
        recommended_policies = []
        if not INSURANCE_DATA.empty:
            logger.info(f"Processing {len(INSURANCE_DATA)} insurance plans for recommendations")
            valid_plans = INSURANCE_DATA.dropna(subset=['type', 'premium', 'coverageLimits'])
            if not valid_plans.empty:
                logger.info(f"Found {len(valid_plans)} valid plans after dropping NaN values")
                valid_types = ['premium', 'home', 'travel', 'basic', 'elite']
                similar_plans = valid_plans[
                    (valid_plans['premium'] <= income_threshold) &
                    (valid_plans['type'].isin(valid_types))
                ].sort_values('premium').head(3)
                if not similar_plans.empty:
                    logger.info(f"Found {len(similar_plans)} matching plans within income threshold {income_threshold}")
                    recommended_policies = similar_plans['name'].tolist()
                    for policy_name in recommended_policies:
                        policy_data = valid_plans[valid_plans['name'] == policy_name].iloc[0].to_dict()
                        try:
                            coverage_total = sum(float(v) for v in policy_data.get('coverageLimits', {}).values() if isinstance(v, (int, float)))
                        except (ValueError, TypeError) as e:
                            coverage_total = 0
                            logger.warning(f"Invalid coverageLimits for {policy_name}: {e}, defaulting to 0")
                        rec = {
                            "userId": str(user.get('_id', ObjectId())),
                            "name": policy_name,
                            "description": f"Enhanced {policy_data.get('type', 'policy')} coverage",
                            "coverage": coverage_total,
                            "premium": float(policy_data.get('premium', 0)),
                            "coverageLimits": policy_data.get('coverageLimits', {}),
                            "type": policy_data.get('type', 'premium'),
                            "matchPercentage": round(100 - abs(prominence_score - 54.5)),
                            "generatedAt": datetime.utcnow().isoformat() + 'Z',
                            "company_name": policy_data.get('company_name', 'xAI Insurance')
                        }
                        try:
                            app.mongo.db.recommendations.insert_one(rec)
                            logger.debug(f"Saved recommendation: {rec['name']}")
                        except Exception as e:
                            logger.error(f"Failed to save recommendation {policy_name} to MongoDB: {str(e)}")
                else:
                    logger.warning(f"No plans found within income threshold {income_threshold}")
            else:
                logger.warning("No valid plans after dropping NaN values")
        else:
            logger.warning("INSURANCE_DATA is empty, likely due to missing or invalid CSV")

        if not recommended_policies:
            logger.info("Falling back to default recommendations")
            recommended_policies = ["Basic Plan", "Premium Plan", "Elite Plan"]
            for policy_name in recommended_policies:
                rec = {
                    "userId": str(user.get('_id', ObjectId())),
                    "name": policy_name,
                    "description": f"Default {policy_name.split()[0].lower()} coverage",
                    "coverage": 5000,
                    "premium": min(5000, income_threshold),  # Use defined income_threshold
                    "coverageLimits": {"default": 5000},
                    "type": policy_name.split()[0].lower(),
                    "matchPercentage": round(100 - abs(prominence_score - 54.5)),
                    "generatedAt": datetime.utcnow().isoformat() + 'Z',
                    "company_name": "xAI Insurance"
                }
                try:
                    app.mongo.db.recommendations.insert_one(rec)
                    logger.debug(f"Saved default recommendation: {rec['name']}")
                except Exception as e:
                    logger.error(f"Failed to save default recommendation {policy_name} to MongoDB: {str(e)}")

        logger.info(f"Form submitted for {email}: Prominence score {prominence_score}, Recommended policies: {recommended_policies}")
        return jsonify({
            "message": "Form submitted successfully",
            "prominenceScore": prominence_score,
            "customerCategory": customer_category,
            "recommendedPolicies": recommended_policies
        }), 200

    except ValueError as ve:
        logger.error(f"Invalid data format for {email}: {str(ve)}")
        return jsonify({"error": f"Invalid data format: {str(ve)}"}), 400
    except Exception as e:
        logger.error(f"Error submitting form for {email}: {str(e)}")
        return jsonify({"error": f"Failed to submit form: {str(e)}"}), 500

@auth_bp.route('/status', methods=['GET'])
def status():
    return jsonify({"message": "Server is running"}), 200