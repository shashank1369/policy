from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging
from datetime import datetime, timedelta
import uuid

activity_bp = Blueprint('activity', __name__)

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

# Store verification codes (in-memory for simplicity; use a proper store like MongoDB in production)
verification_codes = {}

@activity_bp.route('/api/send-verification-code', methods=['POST'])
def send_verification_code():
    data = request.get_json()
    email = data.get('email')
    user_type = data.get('userType')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Generate a random 6-digit code
    code = str(uuid.uuid4().int)[:6]
    verification_codes[email] = {
        'code': code,
        'expires_at': datetime.utcnow() + timedelta(minutes=10)
    }
    logger.info(f"Verification code {code} sent to {email}")
    return jsonify({"message": "Verification code sent"}), 200

@activity_bp.route('/api/verify', methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    if not email or not code:
        return jsonify({"error": "Email and code are required"}), 400

    stored_data = verification_codes.get(email)
    if not stored_data or stored_data['code'] != code or stored_data['expires_at'] < datetime.utcnow():
        logger.error(f"Verification failed for {email}: Invalid or expired code")
        return jsonify({"error": "Invalid or expired verification code"}), 400

    del verification_codes[email]  # Remove code after successful verification
    logger.info(f"Email verified successfully for {email}")
    return jsonify({"message": "Email verified successfully"}), 200

@activity_bp.route('/activities', methods=['POST'])
@token_required
def log_activity(email, user):
    try:
        data = request.get_json()
        required_fields = ['type', 'title', 'date']
        for field in required_fields:
            if field not in data or not data[field]:
                logger.warning(f"Missing required field: {field}")
                return jsonify({"error": f"Missing required field: {field}"}), 400

        activity_data = {
            "id": str(uuid.uuid4()),
            "userId": str(user['_id']),
            "type": data['type'],
            "title": data['title'],
            "description": data.get('description'),
            "date": datetime.fromisoformat(data['date']),
            "page": data.get('page')
        }
        app.mongo.db.activities.insert_one(activity_data)
        logger.info(f"Activity logged for {email}: {activity_data['id']}")
        return jsonify({"message": "Activity logged", "activityId": activity_data['id']}), 201
    except ValueError as e:
        logger.error(f"Invalid data format for {email}: {str(e)}")
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error logging activity for {email}: {str(e)}")
        return jsonify({"error": f"Failed to log activity: {str(e)}"}), 500