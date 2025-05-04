from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging
from datetime import datetime, timedelta
import uuid
from bson.objectid import ObjectId
import numpy as np

prominence_score_bp = Blueprint('prominence_score', __name__)

# Configure logging
logger = logging.getLogger(__name__)

# Load secret key from environment variables
SECRET_KEY = config('SECRET_KEY', default='your-secure-secret-key')

def token_required(f):
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("No or invalid Authorization header")
            return jsonify({"error": "Authentication required"}), 401
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            email = payload.get("email")
            if not email:
                logger.warning("No email in token payload")
                return jsonify({"error": "Invalid token payload"}), 401
            user = app.mongo.db.users.find_one({"email": email})
            if not user:
                logger.warning(f"User not found for email: {email}")
                return jsonify({"error": "User not found"}), 404
            return f(email, user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token: {str(e)}")
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            logger.error(f"Unexpected error decoding token: {str(e)}")
            return jsonify({"error": "Authentication failed"}), 401
    return decorated

@prominence_score_bp.route('/prominence-score', methods=['POST'])
@token_required
def calculate_prominence_score(email, user):
    try:
        data = request.get_json()
        logger.info(f"Received data for prominence score: {data}")

        # Required fields with default values and validation
        required_fields = {
            'age': {'default': 30, 'min': 0, 'type': int},
            'annualIncome': {'default': 0.0, 'min': 0, 'type': float},
            'dependents': {'default': 0, 'min': 0, 'type': int},
            'riskTolerance': {'default': 50, 'min': 0, 'max': 100, 'type': int},
            'creditScore': {'default': 300, 'min': 300, 'max': 900, 'type': int},
            'insuranceHistory': {'default': 'poor', 'options': ['excellent', 'good', 'average', 'poor']},
            'claimHistory': {'default': 'none', 'options': ['none', 'few', 'several']}
        }

        # Optional fields (stored but not used in score calculation yet)
        optional_fields = ['fullName', 'gender', 'email', 'phone', 'occupation', 'education', 'maritalStatus']

        # Validate and process input data
        processed_data = {}
        for field, config in {**required_fields, **{f: {} for f in optional_fields}}.items():
            value = data.get(field)
            if value is None:
                value = config.get('default')
            elif field in required_fields:
                if config.get('type') in [int, float]:
                    try:
                        value = config['type'](value)
                        if 'min' in config and value < config['min']:
                            value = config['default']
                        if 'max' in config and value > config['max']:
                            value = config['default']
                    except (ValueError, TypeError):
                        value = config['default']
                elif 'options' in config and value not in config['options']:
                    value = config['default']
            processed_data[field] = value

        # Prepare input for the ANN model
        ann_model = app.config['ANN_MODEL']
        scaler_prominence = app.config['SCALER_PROMINENCE']
        if not ann_model or not scaler_prominence:
            logger.error("ANN model or scaler not loaded")
            return jsonify({"error": "Server error: Model not available"}), 500

        # Normalize input data (assuming scaler expects a 2D array with specific features)
        input_features = np.array([
            [processed_data['age'], processed_data['annualIncome'], processed_data['dependents'],
             processed_data['riskTolerance'], processed_data['creditScore']]
        ])
        scaled_features = scaler_prominence.transform(input_features)

        # Predict prominence score (assuming model outputs a value between 0 and 1)
        try:
            prediction = ann_model.predict(scaled_features)
            prominence_score = int(prediction[0][0] * 100)  # Scale to 0-100
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            prominence_score = 36  # Default score if prediction fails

        # Determine customer category
        customer_category = "Premium" if prominence_score >= 70 else "Valuable" if prominence_score >= 40 else "Standard"

        # Update user data in MongoDB
        update_data = {
            "full_name": processed_data['fullName'],
            "age": processed_data['age'],
            "gender": processed_data['gender'],
            "email": processed_data['email'] or email,  # Use token email if not provided
            "phone": processed_data['phone'],
            "occupation": processed_data['occupation'],
            "annualIncome": processed_data['annualIncome'],
            "education": processed_data['education'],
            "maritalStatus": processed_data['maritalStatus'],
            "dependents": processed_data['dependents'],
            "creditScore": processed_data['creditScore'],
            "insuranceHistory": processed_data['insuranceHistory'],
            "claimHistory": processed_data['claimHistory'],
            "riskTolerance": processed_data['riskTolerance'],
            "prominenceScore": prominence_score,
            "customerCategory": customer_category,
            "lastUpdated": datetime.utcnow()
        }
        app.mongo.db.users.update_one({"email": email}, {"$set": update_data})
        logger.info(f"Updated user data and calculated prominence score for {email}: {prominence_score}")

        return jsonify({
            "prominenceScore": prominence_score,
            "customerCategory": customer_category,
        }), 200

    except ValueError as e:
        logger.error(f"Invalid data format for {email}: {str(e)}")
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error calculating prominence score for {email}: {str(e)}")
        return jsonify({"error": f"Failed to calculate score: {str(e)}"}), 500
