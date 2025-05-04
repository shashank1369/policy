from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging
from datetime import datetime

company_dashboard_bp = Blueprint('company_dashboard', __name__)

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
            if not user or user.get('user_type') != 'company':
                logger.warning(f"User not found or not a company for email: {email}")
                return jsonify({"error": "Company user not found"}), 404
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

@company_dashboard_bp.route('/company-dashboard', methods=['GET'])
@token_required
def get_company_dashboard(email, user):
    try:
        company_data = {
            "companyName": user.get('company_name'),
            "companyRegNumber": user.get('company_reg_number'),
            "email": user['email'],
            "activePolicies": app.mongo.db.policies.count_documents({"userId": str(user['_id']), "status": "active"}),
            "totalPolicies": app.mongo.db.policies.count_documents({"userId": str(user['_id'])}),
            "customerCount": app.mongo.db.users.count_documents({"user_type": "customer"}),
            "customerTiers": {
                "premium": app.mongo.db.users.count_documents({"user_type": "customer", "customerCategory": "Premium"}),
                "valuable": app.mongo.db.users.count_documents({"user_type": "customer", "customerCategory": "Valuable"}),
                "standard": app.mongo.db.users.count_documents({"user_type": "customer", "customerCategory": "Standard"})
            },
            "totalRevenue": sum(t["amount"] for t in app.mongo.db.transactions.find({"userId": str(user['_id'])})),
            "claimsRatio": 0.05,  # Placeholder, requires claims data implementation
            "lastUpdated": datetime.utcnow()
        }
        logger.info(f"Company dashboard data fetched for {email}")
        return jsonify({"companyDashboard": company_data}), 200
    except Exception as e:
        logger.error(f"Error fetching company dashboard for {email}: {str(e)}")
        return jsonify({"error": f"Failed to fetch company dashboard: {str(e)}"}), 500