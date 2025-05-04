from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging

dashboard_bp = Blueprint('dashboard', __name__)

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

@dashboard_bp.route('/dashboard', methods=['GET'])
@token_required
def user_dashboard(email, user):
    try:
        policies = list(app.mongo.db.policies.find({"userId": str(user['_id'])}))
        profile = app.mongo.db.customerProfiles.find_one({"userId": str(user['_id'])})
        dashboard_data = {
            "user": {"fullName": user.get('fullName'), "email": user['email']},
            "policies": policies,
            "prominenceScore": profile.get('prominenceScore') if profile else None,
            "customerCategory": profile.get('customerCategory') if profile else None
        }
        logger.info(f"Dashboard data fetched for user: {email}")
        return jsonify({"dashboard": dashboard_data}), 200
    except Exception as e:
        logger.error(f"Error fetching dashboard for {email}: {str(e)}")
        return jsonify({"error": f"Failed to fetch dashboard: {str(e)}"}), 500