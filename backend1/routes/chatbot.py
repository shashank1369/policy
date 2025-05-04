from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging

chatbot_bp = Blueprint('chatbot', __name__)

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

@chatbot_bp.route('/chat', methods=['POST'])
@token_required
def chat(email, user):
    try:
        data = request.get_json()
        message = data.get('message')
        if not message:
            return jsonify({"error": "Message is required"}), 400
        # Placeholder for chatbot logic (e.g., AI response)
        response = f"Echo: {message}"
        app.mongo.db.chats.insert_one({"userId": str(user['_id']), "message": message, "response": response, "timestamp": datetime.utcnow()})
        logger.info(f"Chat message processed for {email}")
        return jsonify({"response": response}), 200
    except Exception as e:
        logger.error(f"Error processing chat for {email}: {str(e)}")
        return jsonify({"error": f"Failed to process chat: {str(e)}"}), 500