from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging
import uuid
from datetime import datetime
import pandas as pd
import json
import os
from bson.objectid import ObjectId

recommend_bp = Blueprint('recommend', __name__, url_prefix='/api/recommend')

logger = logging.getLogger(__name__)
SECRET_KEY = config('SECRET_KEY', default='your-secure-secret-key')

def load_policies_from_csv():
    try:
        csv_path = app.config.get('DATASET_PATH', os.path.join(os.path.dirname(__file__), '..', 'insurance_plans_data.csv'))
        logger.info(f"Attempting to load CSV from: {csv_path}")
        if not os.path.exists(csv_path):
            logger.error(f"CSV file not found at: {csv_path}")
            return []
        df = pd.read_csv(csv_path)
        if df.empty:
            logger.warning("CSV file is empty")
            return []
        policies = df.to_dict(orient='records')
        for policy in policies:
            policy['coverageLimits'] = json.loads(policy['coverageLimits'].replace("'", '"')) if isinstance(policy.get('coverageLimits'), str) else {}
            policy['premium'] = float(policy.get('premium', 0))
            if 'type' not in policy or not policy['type']:
                policy['type'] = 'premium'  # Default to premium if missing
        logger.info(f"Successfully loaded {len(policies)} policies with types: {[p['type'] for p in policies]}")
        return policies
    except FileNotFoundError as e:
        logger.error(f"CSV file not found: {str(e)}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in CSV coverageLimits: {str(e)}")
        return []
    except Exception as e:
        logger.error(f"Failed to load policies from CSV: {str(e)}")
        return []

@recommend_bp.route('/recommendations', methods=['GET'], endpoint='get_recommendations')
def get_recommendations():
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

        prominence_score = user.get('prominenceScore', 0)
        logger.info(f"User {email} has prominence score: {prominence_score}")
        if prominence_score == 0:
            return jsonify({
                "recommendations": [],
                "message": "No recommendations available. Please calculate your prominence score first."
            }), 200

        policies = load_policies_from_csv()
        if not policies:
            logger.warning("No policies loaded from CSV")
            return jsonify({
                "recommendations": [],
                "message": "No policies available. Please check the dataset."
            }), 200

        recommendations = []
        for policy in policies:
            try:
                base_coverage = sum(float(v) for v in policy['coverageLimits'].values() if v is not None and isinstance(v, (int, float)))
                base_premium = float(policy.get('premium', 0))
                plan_type = policy.get('type', '').lower()
                coverage_limits = {k: float(v) for k, v in policy['coverageLimits'].items() if v is not None and isinstance(v, (int, float))}

                if prominence_score >= 70:  # Elite
                    target_score = 72.5
                    if plan_type == "elite":
                        match_percentage = 100 - abs(prominence_score - target_score)
                    coverage_factor = 1.3
                    premium_factor = 1.1
                elif prominence_score >= 40:  # Premium (Valuable)
                    target_score = 54.5
                    if plan_type in ['premium', 'basic', 'elite', 'home', 'travel']:
                        match_percentage = 100 - abs(prominence_score - target_score)
                    coverage_factor = 1.2
                    premium_factor = 1.05
                else:  # Basic (Standard)
                    target_score = 36.5
                    if plan_type == "basic":
                        match_percentage = 100 - abs(prominence_score - target_score)
                    coverage_factor = 1.0
                    premium_factor = 1.0

                match_percentage = max(0, min(100, match_percentage or 50))
                if match_percentage > 50:
                    adjusted_coverage = round(base_coverage * coverage_factor)
                    adjusted_premium = round(base_premium * premium_factor)
                    adjusted_limits = {k: round(v * coverage_factor) for k, v in coverage_limits.items()}

                    rec = {
                        "id": str(uuid.uuid4()),
                        "userId": str(user.get('_id', ObjectId())),
                        "name": f"Recommended {plan_type.capitalize()} {policy.get('name', 'Policy')}",
                        "description": f"Enhanced {plan_type} coverage tailored to your profile",
                        "coverage": adjusted_coverage,
                        "premium": adjusted_premium,
                        "coverageLimits": adjusted_limits,
                        "type": plan_type,
                        "matchPercentage": round(match_percentage),
                        "generatedAt": datetime.utcnow().isoformat() + 'Z',
                        "company_name": policy.get('company_name', 'xAI Insurance')
                    }
                    recommendations.append(rec)
                    app.mongo.db.recommendations.insert_one(rec)
                    logger.debug(f"Added recommendation: {rec['name']} with match {match_percentage}%")
            except (ValueError, TypeError) as e:
                logger.warning(f"Invalid policy data for {policy.get('name', 'unknown')}: {str(e)}")
                continue

        if not recommendations:
            logger.warning(f"No valid recommendations generated for {email} with score {prominence_score}")
            return jsonify({
                "recommendations": [],
                "message": "No suitable policies found. Please ensure the CSV contains valid data."
            }), 200

        recommendations.sort(key=lambda x: x['matchPercentage'], reverse=True)
        logger.info(f"Generated {len(recommendations)} recommendations for {email}: {[r['name'] for r in recommendations]}")
        return jsonify({"recommendations": recommendations[:4]}), 200
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {str(e)}")
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        logger.error(f"Error generating recommendations for {email}: {str(e)}")
        return jsonify({"error": f"Failed to generate recommendations: {str(e)}"}), 500

@recommend_bp.route('/chatbot', methods=['POST'], endpoint='chatbot_recommendation')
def chat():
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

        if user.get("user_type") != "customer":
            return jsonify({"error": "Only customers can use chatbot"}), 403

        data = request.get_json() or {}
        user_message = data.get("message", "").lower().strip()
        recommendations = list(app.mongo.db.recommendations.find({"userId": str(user.get('_id', ObjectId()))}))

        if not user_message:
            return jsonify({"response": "Please provide a message to get recommendations! Ask about 'basic', 'premium', 'elite', or your best option."})

        prominence_score = user.get('prominenceScore', 0)
        best_match = None
        if prominence_score >= 70:
            best_match = next((r for r in recommendations if r.get('type') == 'elite'), None)
        elif prominence_score >= 40:
            best_match = next((r for r in recommendations if r.get('type') in ['premium', 'home', 'travel']), None)
        else:
            best_match = next((r for r in recommendations if r.get('type') == 'basic'), None)

        if any(keyword in user_message for keyword in ['basic', 'premium', 'elite', 'best', 'policy', 'recommend']):
            if best_match:
                response = (
                    f"Based on your prominence score of {prominence_score}, the best {best_match['type']} policy for you is "
                    f"{best_match['name']} from {best_match['company_name']}: Coverage ₹{best_match['coverage']:.2f}, "
                    f"Premium ₹{best_match['premium']:.2f}/year with coverage limits: "
                    f"{', '.join([f'{k}: ₹{v:.2f}' for k, v in best_match['coverageLimits'].items()])}"
                )
            else:
                response = f"No {user_message} policy found. Please try again or check your data."
        else:
            response = "Sorry, I couldn't find a matching policy. Ask about 'basic', 'premium', 'elite', or your best option!"

        logger.info(f"Chatbot response for {email}: {response}")
        return jsonify({"response": response})
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {str(e)}")
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        logger.error(f"Error in chatbot for {email}: {str(e)}")
        return jsonify({"error": f"Chatbot failed: {str(e)}"}), 500