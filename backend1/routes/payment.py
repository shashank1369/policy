from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging
import uuid
from datetime import datetime

payment_bp = Blueprint('payment', __name__, url_prefix='/api/payment')

logger = logging.getLogger(__name__)

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

@payment_bp.route('/payment', methods=['POST'], endpoint='payment_process')
@token_required
def process_payment(email, user):
    try:
        data = request.get_json()
        required_fields = ['policyId', 'amount', 'paymentMethod']
        for field in required_fields:
            if field not in data or not data[field]:
                logger.warning(f"Missing required field: {field}")
                return jsonify({"error": f"Missing required field: {field}"}), 400

        transaction_data = {
            "userId": str(user['_id']),
            "policyId": data['policyId'],
            "amount": float(data['amount']),
            "paymentMethod": data['paymentMethod'],
            "status": "completed",
            "timestamp": datetime.utcnow(),
            "transactionId": str(uuid.uuid4()),
            "providerRef": data.get('providerRef', 'simulated_ref')
        }
        app.mongo.db.transactions.insert_one(transaction_data)
        logger.info(f"Payment simulated for {email}: {transaction_data['transactionId']}")

        return jsonify({
            "message": "Payment processed successfully (simulated)",
            "transactionId": transaction_data['transactionId']
        }), 200
    except ValueError as e:
        logger.error(f"Invalid data format for {email}: {str(e)}")
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error processing payment for {email}: {str(e)}")
        return jsonify({"error": f"Failed to process payment: {str(e)}"}), 500