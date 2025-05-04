from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging

premium_calculator_bp = Blueprint('premium_calculator', __name__)

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

@premium_calculator_bp.route('/premium-calculator', methods=['POST'])
@token_required
def calculate_premium(email, user):
    try:
        data = request.get_json()
        if 'propertyValue' in data and 'propertyAge' in data:
            coverage = float(data['propertyValue']) * 1.2
            premium = (float(data['propertyValue']) * 0.001) + (int(data['propertyAge']) * 50)
        elif 'tripDuration' in data:
            coverage = 500000
            premium = 2000 + {"short": 0, "medium": 500, "long": 1000, "extended": 2000}.get(data['tripDuration'], 0)
        else:
            logger.warning("Invalid input for premium calculation")
            return jsonify({"error": "Invalid input for premium calculation"}), 400

        logger.info(f"Premium calculated for {email}: coverage={coverage}, premium={premium}")
        return jsonify({"coverage": coverage, "premium": premium}), 200
    except ValueError as e:
        logger.error(f"Invalid data format for {email}: {str(e)}")
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error calculating premium for {email}: {str(e)}")
        return jsonify({"error": f"Failed to calculate premium: {str(e)}"}), 500