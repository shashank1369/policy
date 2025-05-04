from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from decouple import config
from flask_pymongo import PyMongo
from routes.auth import auth_bp
from routes.activity import activity_bp
from routes.chatbot import chatbot_bp
from routes.common_form import common_form_bp
from routes.company_dashboard import company_dashboard_bp
from routes.contact import contact_bp
from routes.dashboard import dashboard_bp
from routes.form_home import form_home_bp
from routes.form_travel import form_travel_bp
from routes.payment import payment_bp
from routes.premium_calculator import premium_calculator_bp
from routes.prominence_score import prominence_score_bp
from routes.recommend import recommend_bp
from routes.transactions import transactions_bp
from routes.ocr import ocr_bp
from routes.signup import signup_bp
from werkzeug.security import generate_password_hash
from datetime import datetime
import jwt

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
app.config['SENDER_EMAIL'] = config('SENDER_EMAIL', default='')
app.config['SENDER_PASSWORD'] = config('SENDER_PASSWORD', default='')
app.config['SMTP_SERVER'] = config('SMTP_SERVER', default='smtp.gmail.com')
app.config['SMTP_PORT'] = config('SMTP_PORT', default=587, cast=int)
app.config['SECRET_KEY'] = config('SECRET_KEY', default='your-secure-secret-key')
app.config['MONGO_URI'] = config('MONGO_URI', default='mongodb://localhost:27017/insurance_db')
app.config['DATASET_PATH'] = config('DATASET_PATH', default='insurance_plans_data.csv')

# Initialize PyMongo
try:
    app.mongo = PyMongo(app)
    logger.info("Successfully connected to MongoDB")

    # Initialize sample data
    if app.mongo.db.users.count_documents({}) == 0:
        app.mongo.db.users.insert_many([
            {"email": "customer@example.com", "password": generate_password_hash("hashedpassword"), "user_type": "customer", "full_name": "John Doe", "prominenceScore": 0, "customerCategory": "Standard", "activities": [], "age": 30, "annualIncome": 0, "dependents": 0, "riskTolerance": 50, "creditScore": 300},
            {"email": "company1@example.com", "password": generate_password_hash("hashedpassword"), "user_type": "company", "company_name": "InsureCo", "company_reg_number": "REG123", "activities": []},
            {"email": "company2@example.com", "password": generate_password_hash("hashedpassword"), "user_type": "company", "company_name": "TravelSafe", "company_reg_number": "REG456", "activities": []}
        ])
    if app.mongo.db.policies.count_documents({}) == 0:
        app.mongo.db.policies.insert_many([
            {"policy_id": "P001", "type": "home", "coverage": "₹7500000", "premium": 18500, "eligibility": "All homeowners", "company_name": "InsureCo", "userId": "customer@example.com"},
            {"policy_id": "P002", "type": "travel", "coverage": "₹5000000", "premium": 12500, "eligibility": "All travelers", "company_name": "TravelSafe", "userId": "customer@example.com"}
        ])
    if app.mongo.db.transactions.count_documents({}) == 0:
        app.mongo.db.transactions.insert_one({"userId": "customer@example.com", "policyId": "P001", "amount": 18500, "status": "completed"})
except Exception as e:
    logger.error(f"Failed to connect to MongoDB or initialize data: {str(e)}")
    raise

# Register blueprints with unique URL prefixes
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(activity_bp, url_prefix='/api/activity')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
app.register_blueprint(common_form_bp, url_prefix='/api/common-form')
app.register_blueprint(company_dashboard_bp, url_prefix='/api/company-dashboard')
app.register_blueprint(contact_bp, url_prefix='/api/contact')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(form_home_bp, url_prefix='/api/form-home')
app.register_blueprint(form_travel_bp, url_prefix='/api/form-travel')
app.register_blueprint(payment_bp, url_prefix='/api/payment')
app.register_blueprint(premium_calculator_bp, url_prefix='/api/premium-calculator')
app.register_blueprint(prominence_score_bp, url_prefix='/api/prominence-score')
app.register_blueprint(recommend_bp, url_prefix='/api/recommend')
app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
app.register_blueprint(ocr_bp, url_prefix='/api/ocr')
app.register_blueprint(signup_bp, url_prefix='/api/signup')

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    logger.warning(f"404 - Path not found: /{path}")
    return jsonify({"message": "API endpoint not found. Please use /api/* routes."}), 404

if __name__ == '__main__':
    logger.info("Starting Flask server on http://localhost:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)