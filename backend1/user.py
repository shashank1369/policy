from flask import Blueprint, request, jsonify
from flask import current_app as app
import logging
from flask_pymongo import PyMongo

user_bp = Blueprint('user', __name__)
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

@user_bp.route('/user', methods=['GET'], endpoint='get_user_endpoint')
@token_required
def get_user(email):
    try:
        logger.info(f"Fetching user for email: {email}")
        user = mongo.db.users.find_one({"email": email})
        if not user:
            logger.warning(f"User not found for email: {email}. Database contents: {list(mongo.db.users.find())}")
            return jsonify({"error": "User not found"}), 404

        user_data = {k: v for k, v in user.items() if k != "password"}
        logger.info(f"User details fetched for: {email}, data: {user_data}")
        return jsonify(user_data), 200
    except Exception as e:
        logger.error(f"Error fetching user for {email}: {str(e)}")
        return jsonify({"error": f"Failed to fetch user: {str(e)}"}), 500

@user_bp.route('/user/data', methods=['GET'], endpoint='get_user_data_endpoint')
@token_required
def get_user_data(email):
    try:
        logger.info(f"Fetching user data for email: {email}")
        user = mongo.db.users.find_one({"email": email})
        if not user:
            logger.warning(f"User not found for email: {email}. Database contents: {list(mongo.db.users.find())}")
            return jsonify({"error": "User not found"}), 404

        user_data = {k: v for k, v in user.items() if k != "password"}
        return jsonify({
            "user": user_data,
            "transactions": user.get("transactions", []),
            "chats": user.get("chats", []),
            "payments": user.get("payments", []),
            "claims": user.get("claims", [])
        }), 200
    except Exception as e:
        logger.error(f"Error fetching user data for {email}: {str(e)}")
        return jsonify({"error": f"Failed to fetch user data: {str(e)}"}), 500