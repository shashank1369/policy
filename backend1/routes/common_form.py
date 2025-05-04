from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging
from datetime import datetime
import uuid

# Initialize Blueprint
common_form_bp = Blueprint('common_form', __name__)

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Load secret key from environment variables
SECRET_KEY = config('SECRET_KEY', default='your-secure-secret-key')

def token_required(f):
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("No or invalid Authorization header")
            return jsonify({"error": "Authentication required. Please log in."}), 401
        token = auth_header.split(' ')[1]
        if not token or not isinstance(token, str) or len(token.split('.')) != 3:
            logger.error("Invalid token format detected")
            return jsonify({"error": "Invalid token format. Please log in again."}), 401
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            email = payload.get("email")
            if not email:
                logger.warning("No email in token payload")
                return jsonify({"error": "Invalid token payload. Please log in again."}), 401
            user = app.mongo.db.users.find_one({"email": email})
            if not user:
                logger.warning(f"User not found for email: {email}")
                return jsonify({"error": "User not found. Please log in again."}), 404
            return f(email, user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            return jsonify({"error": "Token has expired. Please log in again."}), 401
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token: {str(e)}")
            return jsonify({"error": "Invalid token. Please log in again."}), 401
        except Exception as e:
            logger.error(f"Unexpected error decoding token: {str(e)}")
            return jsonify({"error": "Authentication failed. Please log in again."}), 401
    return decorated

@common_form_bp.route('/common-form', methods=['POST'])
@token_required
def submit_common_form(email, user):
    try:
        logger.info(f"Received POST request for /common-form with data: {request.get_json()}")
        data = request.get_json()
        if not data:
            logger.warning("No JSON data provided in request")
            return jsonify({"error": "No data provided"}), 400

        required_fields = [
            'fullName', 'age', 'gender', 'email', 'phone', 'occupation',
            'annualIncome', 'education', 'maritalStatus', 'dependents', 'riskTolerance'
        ]
        for field in required_fields:
            if field not in data or not data[field]:
                logger.warning(f"Missing required field: {field}")
                return jsonify({"error": f"Missing required field: {field}"}), 400

        user_update = {
            "fullName": data['fullName'],
            "age": int(data['age']) if data['age'].isdigit() and int(data['age']) > 0 else 30,
            "gender": data['gender'],
            "phone": data['phone'],
            "occupation": data['occupation'],
            "annualIncome": float(data['annualIncome']) if data['annualIncome'].replace('.', '').isdigit() and float(data['annualIncome']) >= 0 else 0.0,
            "education": data['education'],
            "maritalStatus": data['maritalStatus'],
            "dependents": int(data['dependents']) if data['dependents'].isdigit() and int(data['dependents']) >= 0 else 0,
            "riskTolerance": int(data['riskTolerance']) if data['riskTolerance'].isdigit() and 0 <= int(data['riskTolerance']) <= 100 else 50
        }
        app.mongo.db.users.update_one({"email": email}, {"$set": user_update}, upsert=True)
        logger.info(f"User profile updated for {email}")

        age_score = min(user_update['age'], 30) * 0.3
        income_score = min((user_update['annualIncome'] / 100000) * 20, 30) * 0.3
        dependents_score = min(user_update['dependents'] * 10, 20) * 0.2
        risk_score = min(user_update['riskTolerance'] / 10, 20) * 0.2
        total_score = min(age_score + income_score + dependents_score + risk_score, 100)
        category = "Premium" if total_score >= 70 else "Valuable" if total_score >= 40 else "Standard"

        profile_data = {
            "id": str(uuid.uuid4()),
            "userId": str(user['_id']),
            "prominenceScore": int(total_score),
            "customerCategory": category,
            "calculatedAt": datetime.utcnow(),
            "email": email
        }
        app.mongo.db.customerProfiles.insert_one(profile_data)
        logger.info(f"Customer profile created for {email} with score {total_score}")

        return jsonify({
            "message": "Profile submitted and prominence score calculated",
            "prominenceScore": int(total_score),
            "customerCategory": category,
            "profileId": str(profile_data['id'])
        }), 201

    except ValueError as e:
        logger.error(f"Invalid data format for {email}: {str(e)}")
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except TypeError as e:
        logger.error(f"Type error processing data for {email}: {str(e)}")
        return jsonify({"error": f"Invalid data type: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error processing form for {email}: {str(e)}")
        return jsonify({"error": f"Failed to process form: {str(e)}"}), 500

@common_form_bp.route('/health', methods=['GET'])
def health_check():
    logger.info("Health check requested")
    return jsonify({"status": "healthy"}), 200