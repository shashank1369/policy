from flask import Blueprint, request, jsonify
from flask import current_app as app
import logging
from flask_pymongo import PyMongo

insurance_bp = Blueprint('insurance', __name__)
mongo = PyMongo(app)
logger = logging.getLogger(__name__)

def token_required(f):
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        logger.info(f"Received Authorization header: {auth_header}")
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("No or invalid Authorization header")
            return jsonify({"error": "Authorization token required"}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            email = payload.get("email")
            if not email:
                logger.warning("No email in token payload")
                return jsonify({"error": "Invalid token payload"}), 401
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return jsonify({"error": "Invalid token"}), 401
        return f(email, *args, **kwargs)
    return decorated

@insurance_bp.route('/insurance/home/register', methods=['POST'])
@token_required
def register_home_insurance(email):
    try:
        data = request.get_json()
        # Add logic to register home insurance (e.g., store in user document)
        user = mongo.db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404
        insurance_data = data.get('insuranceData', {})
        mongo.db.users.update_one({"email": email}, {"$push": {"claims": insurance_data}})
        logger.info(f"Home insurance registered for {email}")
        return jsonify({"message": "Home insurance registered successfully"}), 200
    except Exception as e:
        logger.error(f"Error registering home insurance for {email}: {str(e)}")
        return jsonify({"error": f"Failed to register: {str(e)}"}), 500

@insurance_bp.route('/insurance/travel/register', methods=['POST'])
@token_required
def register_travel_insurance(email):
    try:
        data = request.get_json()
        # Add logic to register travel insurance
        user = mongo.db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404
        insurance_data = data.get('insuranceData', {})
        mongo.db.users.update_one({"email": email}, {"$push": {"claims": insurance_data}})
        logger.info(f"Travel insurance registered for {email}")
        return jsonify({"message": "Travel insurance registered successfully"}), 200
    except Exception as e:
        logger.error(f"Error registering travel insurance for {email}: {str(e)}")
        return jsonify({"error": f"Failed to register: {str(e)}"}), 500