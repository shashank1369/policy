from datetime import datetime

schemas = {
    "users": {
        "name": {"type": str, "required": False},  # Optional for customers, required for companies if clarified
        "email": {"type": str, "required": True, "unique": True},
        "password": {"type": str, "required": True},  # Hashed
        "userType": {"type": str, "required": True, "enum": ["customer", "company"]},
        "companyName": {"type": str, "required": False},  # Should be required for userType "company"
        "companyRegNumber": {"type": str, "required": False},  # Should be required for userType "company"
        "isVerified": {"type": bool, "default": False},
        "verificationToken": {"type": str, "required": False},  # For email verification
        "insurancePlans": {"type": list, "default": []},  # Array of policy IDs
        "createdAt": {"type": datetime, "default": datetime.utcnow},
        # Profile fields from CommonFormPage
        "fullName": {"type": str, "required": False},
        "age": {"type": int, "required": False},
        "gender": {"type": str, "required": False, "enum": ["male", "female", "other", "prefer-not-to-say"]},
        "phone": {"type": str, "required": False},
        "occupation": {"type": str, "required": False},
        "annualIncome": {"type": float, "required": False},  # In ₹
        "education": {"type": str, "required": False, "enum": ["high-school", "bachelors", "masters", "doctorate", "other"]},
        "maritalStatus": {"type": str, "required": False, "enum": ["single", "married", "divorced", "widowed"]},
        "dependents": {"type": int, "required": False},
        "riskTolerance": {"type": int, "required": False, "min": 0, "max": 100}
    },
    "customerProfiles": {  # New collection for prominence score and category
        "id": {"type": str, "required": True},
        "userId": {"type": str, "required": True},  # Link to users._id
        "prominenceScore": {"type": int, "required": True, "min": 0, "max": 100},
        "customerCategory": {"type": str, "required": True, "enum": ["Standard", "Valuable", "Premium"]},
        "calculatedAt": {"type": datetime, "default": datetime.utcnow},
        "updatedAt": {"type": datetime, "default": datetime.utcnow}
    },
    "policies": {
        "id": {"type": str, "required": True},
        "name": {"type": str, "required": True},
        "type": {"type": str, "required": True, "enum": ["home", "travel"]},
        "policyNumber": {"type": str, "required": True},
        "coverage": {"type": float, "required": True},
        "premium": {"type": float, "required": True},
        "status": {"type": str, "required": True, "enum": ["pending", "active", "expired"]},
        "iconColor": {"type": str, "required": False},
        "userId": {"type": str, "required": True},
        "startDate": {"type": datetime, "required": True},
        "endDate": {"type": datetime, "required": True},
        "propertyType": {"type": str, "required": False, "enum": ["apartment", "independent", "villa", "condo", "other"]},
        "propertyValue": {"type": float, "required": False},
        "propertyAge": {"type": int, "required": False},
        "propertySize": {"type": int, "required": False},
        "propertyAddress": {"type": str, "required": False},
        "securitySystem": {"type": bool, "required": False},
        "fireProtection": {"type": bool, "required": False},
        "floodZone": {"type": str, "required": False, "enum": ["yes", "no", "unknown"]},
        "previousClaims": {"type": str, "required": False, "enum": ["yes", "no"]},
        "travelFrequency": {"type": str, "required": False, "enum": ["rarely", "occasionally", "frequently", "veryFrequently"]},
        "destinationType": {"type": str, "required": False, "enum": ["domestic", "international", "both"]},
        "tripDuration": {"type": str, "required": False, "enum": ["short", "medium", "long", "extended"]},
        "travelPurpose": {"type": str, "required": False, "enum": ["leisure", "business", "education", "medical", "mixed"]},
        "travelCompanions": {"type": str, "required": False, "enum": ["alone", "partner", "family", "friends", "group"]},
        "medicalConditions": {"type": bool, "required": False},
        "adventureActivities": {"type": bool, "required": False}
    },
    "insurancePlans": {
        "id": {"type": str, "required": True},
        "name": {"type": str, "required": True, "enum": ["Basic Plan", "Premium Plan", "Elite Plan"]},
        "premium": {"type": float, "required": True},
        "coverageLimits": {
            "type": dict,
            "schema": {
                "tripCancellation": {"type": float, "required": True},
                "medicalExpenses": {"type": float, "required": True},
                "baggageLoss": {"type": float, "required": True},
                "travelDelay": {"type": float, "required": False},
                "adventureActivities": {"type": bool, "required": False},
                "luxuryAccommodation": {"type": bool, "required": False},
                "vipAssistance": {"type": bool, "required": False},
                "conciergeServices": {"type": bool, "required": False}
            }
        },
        "type": {"type": str, "required": True, "enum": ["home", "travel"]},
        "createdAt": {"type": datetime, "default": datetime.utcnow}
    },
    "recommendations": {
        "id": {"type": str, "required": True},
        "userId": {"type": str, "required": True},
        "name": {"type": str, "required": True},
        "imageUrl": {"type": str, "required": False},
        "description": {"type": str, "required": False},
        "coverage": {"type": float, "required": True},
        "premium": {"type": float, "required": True},
        "type": {"type": str, "required": True, "enum": ["home", "travel"]},
        "matchPercentage": {"type": float, "required": True},
        "generatedAt": {"type": datetime, "default": datetime.utcnow}
    },
    "activities": {
        "id": {"type": str, "required": True},
        "userId": {"type": str, "required": True},
        "type": {"type": str, "required": True, "enum": ["payment", "document", "claim", "support", "calculation", "policy"]},
        "title": {"type": str, "required": True},
        "description": {"type": str, "required": False},
        "date": {"type": datetime, "required": True},
        "page": {"type": str, "required": False}
    },
    "chats": {  # New schema for chatbot interactions
        "id": {"type": str, "required": True},
        "userId": {"type": str, "required": True},
        "message": {"type": str, "required": True},
        "response": {"type": str, "required": True},
        "timestamp": {"type": datetime, "default": datetime.utcnow}
    },
    "claims": {
        "id": {"type": str, "required": True},
        "policyId": {"type": str, "required": True},
        "policyType": {"type": str, "required": True, "enum": ["home", "travel"]},
        "claimNumber": {"type": str, "required": True},
        "customerName": {"type": str, "required": False},
        "filedDate": {"type": datetime, "required": True},
        "description": {"type": str, "required": True},
        "amount": {"type": float, "required": True},
        "status": {"type": str, "required": True, "enum": ["pending", "processing", "approved", "rejected"]},
        "userId": {"type": str, "required": True}
    },
    "insuranceProducts": {
        "id": {"type": str, "required": True},
        "name": {"type": str, "required": True},
        "description": {"type": str, "required": False},
        "activePolicies": {"type": int, "required": True},
        "revenue": {"type": float, "required": True},
        "claimsRatio": {"type": float, "required": True},
        "companyId": {"type": str, "required": True}
    },
    "customers": {
        "id": {"type": str, "required": True},
        "name": {"type": str, "required": True},
        "initials": {"type": str, "required": True},
        "tier": {"type": str, "required": True, "enum": ["premium", "valuable", "standard"]},
        "policyCount": {"type": int, "required": True},
        "companyId": {"type": str, "required": True}
    },
    "transactions": {
        "userId": {"type": str, "required": True},
        "policyId": {"type": str, "required": True},
        "amount": {"type": float, "required": True},
        "paymentMethod": {"type": str, "required": True},
        "status": {"type": str, "default": "pending"},
        "timestamp": {"type": datetime, "default": datetime.utcnow},
        "transactionId": {"type": str, "required": False},
        "providerRef": {"type": str, "required": False}
    },
    "documents": {
        "userId": {"type": str, "required": True},
        "fileName": {"type": str, "required": True},
        "content": {"type": str, "required": True},
        "uploadDate": {"type": datetime, "default": datetime.utcnow},
        "fileType": {"type": str, "required": False},
        "fileUrl": {"type": str, "required": False},
        "claimId": {"type": str, "required": False}
    },
    "inquiries": {
        "id": {"type": str, "required": True},
        "userId": {"type": str, "required": False},
        "contactName": {"type": str, "required": True},
        "phone": {"type": str, "required": True},
        "email": {"type": str, "required": True},
        "address": {"type": str, "required": False},
        "additionalNotes": {"type": str, "required": False},
        "createdAt": {"type": datetime, "default": datetime.utcnow}
    }
}

def validate_schema(data, schema_name):
    """
    Validate data against a specified schema.
    Returns: tuple (is_valid: bool, errors: dict)
    """
    schema = schemas.get(schema_name)
    if not schema:
        return False, {"error": f"Invalid schema name: {schema_name}"}
    
    errors = {}
    for field, props in schema.items():
        if props.get('required') and (field not in data or not data.get(field)):
            errors[field] = "Required field missing"
        elif field in data and data[field] is not None:  # Only validate if field is present and not None
            value = data[field]
            if props.get('type') and not isinstance(value, props['type']):
                errors[field] = f"Expected type {props['type'].__name__}, got {type(value).__name__}"
            if props.get('enum') and value not in props['enum']:
                errors[field] = f"Value must be one of {props['enum']}"
            if props.get('min') and isinstance(value, (int, float)) and value < props['min']:
                errors[field] = f"Value must be >= {props['min']}"
            if props.get('max') and isinstance(value, (int, float)) and value > props['max']:
                errors[field] = f"Value must be <= {props['max']}"
            if props.get('schema') and isinstance(value, dict):  # Nested schema validation
                is_valid_nested, nested_errors = validate_schema(value, field)
                if not is_valid_nested:
                    errors[field] = nested_errors
    return len(errors) == 0, errors

# Example usage (uncomment to test)
if __name__ == "__main__":
    test_data = {
        "email": "test@example.com",
        "password": "hashedpassword",
        "userType": "customer",
        "fullName": "John Doe",
        "age": 25,
        "gender": "male",
        "annualIncome": 50000.0
    }
    is_valid, errors = validate_schema(test_data, "users")
    print(f"Valid: {is_valid}, Errors: {errors}")