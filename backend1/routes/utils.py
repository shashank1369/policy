from flask import Blueprint, request, jsonify

bp = Blueprint('utils', __name__)

@bp.route('/utils/validate', methods=['POST'])
def validate_data():
    data = request.get_json()
    schema_name = data.get('schema')
    if not schema_name or schema_name not in schemas:
        return jsonify({"error": "Invalid schema name"}), 400

    schema = schemas[schema_name]
    errors = {}
    for field, props in schema.items():
        if props.get('required') and (field not in data or not data[field]):
            errors[field] = "Required field missing"
        elif field in data:
            if props.get('type') and not isinstance(data[field], props['type']):
                errors[field] = f"Expected type {props['type'].__name__}"
            if props.get('enum') and data[field] not in props['enum']:
                errors[field] = f"Value must be one of {props['enum']}"
    return jsonify({"valid": len(errors) == 0, "errors": errors}), 200