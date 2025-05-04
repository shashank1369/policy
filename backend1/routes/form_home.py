from flask import Blueprint, request, jsonify
from flask import current_app as app
from utils.schemas import validate_schema
from datetime import datetime, timedelta
import uuid
import jwt
from decouple import config
import logging

form_home_bp = Blueprint('form_home', __name__)

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

@form_home_bp.route('/insurance/home/register', methods=['POST'])
@token_required
def register_home_insurance(email, user):
    try:
        data = request.get_json()
        required_fields = ['propertyType', 'propertyValue', 'propertyAge', 'propertySize', 'propertyAddress']
        for field in required_fields:
            if field not in data or not data[field]:
                logger.warning(f"Missing required field: {field}")
                return jsonify({"error": f"Missing required field: {field}"}), 400

        is_valid, errors = validate_schema(data, "policies")
        if not is_valid:
            logger.error(f"Policy data validation failed: {errors}")
            return jsonify({"error": "Invalid policy data", "details": errors}), 400

        coverage = float(data['propertyValue']) * 1.2
        premium = (float(data['propertyValue']) * 0.001) + (int(data['propertyAge']) * 50)

        policy_data = {
            "id": str(uuid.uuid4()),
            "name": f"Home Insurance - {data['propertyAddress'].split(',')[0]}",
            "type": "home",
            "policyNumber": f"HOME-{int(datetime.utcnow().timestamp())}",
            "coverage": coverage,
            "premium": premium,
            "status": "pending",
            "iconColor": "from-emerald-600",
            "userId": str(user['_id']),
            "startDate": datetime.utcnow(),
            "endDate": datetime.utcnow() + timedelta(days=365),
            "propertyType": data['propertyType'],
            "propertyValue": float(data['propertyValue']),
            "propertyAge": int(data['propertyAge']),
            "propertySize": int(data['propertySize']),
            "propertyAddress": data['propertyAddress'],
            "securitySystem": data.get('securitySystem', False),
            "fireProtection": data.get('fireProtection', False),
            "floodZone": data.get('floodZone'),
            "previousClaims": data.get('previousClaims')
        }
        result = app.mongo.db.policies.insert_one(policy_data)
        logger.info(f"Home insurance registered for {email}: {result.inserted_id}")
        return jsonify({"message": "Home insurance registered", "policyId": str(result.inserted_id)}), 201
    except ValueError as e:
        logger.error(f"Invalid data format for {email}: {str(e)}")
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error registering home insurance for {email}: {str(e)}")
        return jsonify({"error": f"Failed to register: {str(e)}"}), 500