from flask import Blueprint, jsonify, request, current_app
from models.property import Property, db

property_bp = Blueprint('property', __name__)

@property_bp.route('/properties', methods=['GET'])
def get_properties():
    # Get page and items per page from query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    
    # Get paginated properties
    paginated_properties = Property.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    # Return paginated response
    return jsonify({
        'properties': [p.to_dict() for p in paginated_properties.items],
        'total': paginated_properties.total,
        'current_page': page,
        'total_pages': paginated_properties.pages,
        'has_next': paginated_properties.has_next,
        'has_prev': paginated_properties.has_prev
    })

@property_bp.route('/properties/<int:id>', methods=['GET'])
def get_property(id):
    """Retrieve a specific property by its ID."""
    property = db.session.get(Property, id)
    
    if not property:
        return jsonify({'error': 'Resource not found'}), 404
    
    return jsonify(property.to_dict()), 200

@property_bp.route('/properties', methods=['POST'])
def create_property():
    try:
        data = request.get_json()
        
        # Check for required fields
        required_fields = ['title', 'description', 'price', 'address', 'city', 'state', 'zip_code']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400
            
        new_property = Property(**data)
        db.session.add(new_property)
        db.session.commit()
        return jsonify(new_property.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating property: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@property_bp.route('/properties/<int:id>', methods=['PUT'])
def update_property(id):
    """Update an existing property."""
    property = db.session.get(Property, id)
    
    if not property:
        return jsonify({'error': 'Resource not found'}), 404
    
    data = request.get_json()
    
    for key, value in data.items():
        setattr(property, key, value)
    
    try:
        db.session.commit()
        return jsonify(property.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating property: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@property_bp.route('/properties/<int:id>', methods=['DELETE'])
def delete_property(id):
    """Delete a property."""
    property = db.session.get(Property, id)
    
    if not property:
        return jsonify({'error': 'Resource not found'}), 404
    
    try:
        db.session.delete(property)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting property: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500