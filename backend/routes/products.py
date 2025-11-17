from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from utils.jwt_helper import role_required
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError

products_bp = Blueprint('products', __name__)

def error_response(message="Something went wrong", status=500):
    return jsonify({"error": message}), status

#-------------------------  LIST PRODUCT   --------------------------
@products_bp.route('/list_product', methods=['GET'])
def list_products():
    try:
        items = Product.query.all()
        return jsonify([p.to_dict() for p in items])
    except Exception as e:
        return error_response(str(e))


#-------------------------  GET PRODUCT   --------------------------
@products_bp.route('/get/<int:id>', methods=['GET'])
def get_product(id):
    try:
        p = Product.query.get(id)
        if not p:
            return error_response("Product not found", 404)
        return jsonify(p.to_dict())
    except Exception as e:
        return error_response(str(e))


#-------------------------  ADD PRODUCT   --------------------------
@products_bp.route('/add', methods=['POST'])
@jwt_required()
@role_required('admin')
def add_product():
    try:
        data = request.json or {}

        if not data.get("id") or not data.get("name"):
            return error_response("id and name are required", 400)

        # check duplicate
        if Product.query.get(data['id']):
            return error_response("Product with this ID already exists", 400)

        p = Product(
            id=data['id'],
            name=data['name'],
            model=data.get('model'),
            description=data.get('description')
        )

        db.session.add(p)
        db.session.commit()

        return jsonify({'product': p.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return error_response(str(e))


#-------------------------  UPDATE PRODUCT   --------------------------
@products_bp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_product(id):
    try:
        p = Product.query.get(id)

        if not p:
            return error_response("Product not found", 404)

        data = request.json or {}

        p.name = data.get('name', p.name)
        p.model = data.get('model', p.model)
        p.description = data.get('description', p.description)

        db.session.commit()

        return jsonify({'product': p.to_dict()})

    except Exception as e:
        db.session.rollback()
        return error_response(str(e))


#-------------------------  DELETE PRODUCT   --------------------------
@products_bp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_product(id):
    try:
        p = Product.query.get(id)

        if not p:
            return error_response("Product not found", 404)

        db.session.delete(p)
        db.session.commit()

        return jsonify({'message': 'deleted'})

    except Exception as e:
        db.session.rollback()
        return error_response(str(e))
