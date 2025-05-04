from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging
import uuid
from datetime import datetime

contact_bp = Blueprint('contact', __name__)

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

@contact_bp.route('/contact', methods=['POST'])
@token_required
def submit_contact(email, user):
    try:
        data = request.get_json()
        required_fields = ['contactName', 'phone', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                logger.warning(f"Missing required field: {field}")
                return jsonify({"error": f"Missing required field: {field}"}), 400

        inquiry_data = {
            "id": str(uuid.uuid4()),
            "userId": str(user['_id']),
            "contactName": data['contactName'],
            "phone": data['phone'],
            "email": data['email'],
            "address": data.get('address'),
            "additionalNotes": data.get('additionalNotes'),
            "createdAt": datetime.utcnow()
        }
        app.mongo.db.inquiries.insert_one(inquiry_data)
        logger.info(f"Contact inquiry submitted for {email}: {inquiry_data['id']}")
        return jsonify({"message": "Contact inquiry submitted", "inquiryId": inquiry_data['id']}), 201
    except Exception as e:
        logger.error(f"Error submitting contact form for {email}: {str(e)}")
        return jsonify({"error": f"Failed to submit contact: {str(e)}"}), 500