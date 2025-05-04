from flask import Blueprint, request, jsonify
from flask import current_app as app
import jwt
from decouple import config
import logging
from PIL import Image
import pytesseract
import uuid
from datetime import datetime
import os
import tempfile
from werkzeug.utils import secure_filename

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

ocr_bp = Blueprint('ocr', __name__)

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)

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

@ocr_bp.route('/upload-ocr', methods=['POST'])
@token_required
def process_ocr(email, user):
    try:
        if 'file' not in request.files:
            logger.warning("No file part in request")
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            logger.warning("No selected file")
            return jsonify({"error": "No selected file"}), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name

        try:
            img = Image.open(temp_path)
            text = pytesseract.image_to_string(img).strip()
            if not text:
                raise ValueError("No text extracted from image")
        except Exception as e:
            logger.error(f"Image processing error: {str(e)}")
            os.remove(temp_path)
            return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500

        os.remove(temp_path)

        document_data = {
            "id": str(uuid.uuid4()),
            "userId": str(user['_id']),
            "email": email,
            "fileName": secure_filename(file.filename),
            "content": text,
            "uploadDate": datetime.utcnow(),
            "fileType": file.content_type,
            "claimId": request.form.get('claimId')
        }
        app.mongo.db.documents.insert_one(document_data)
        logger.info(f"OCR processed and document uploaded for {email}: {file.filename}")

        return jsonify({
            "message": "OCR processed and document uploaded",
            "documentId": document_data['id'],
            "extractedText": text
        }), 201
    except Exception as e:
        logger.error(f"Error processing OCR for {email}: {str(e)}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": f"Failed to process OCR: {str(e)}"}), 500

@ocr_bp.route('/health', methods=['GET'])
def health_check():
    logger.info("Health check requested")
    return jsonify({"status": "healthy"}), 200