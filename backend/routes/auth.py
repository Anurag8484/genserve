from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from datetime import timedelta
from sqlalchemy.exc import SQLAlchemyError

auth_bp = Blueprint('auth', __name__)


def error_response(message="Something went wrong", status=500):
    return jsonify({"error": message}), status

#-------------------------  REGISTER   --------------------------
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json or {}

        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'customer')

        if not email or not password:
            return error_response("email and password required", 400)

        if User.query.filter_by(email=email).first():
            return error_response("User already exists", 400)

        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            name=name,
            role=role
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'registered', 'user': user.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return error_response(str(e))


#-------------------------  LOGIN   --------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json or {}
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return error_response("email and password required", 400)

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password_hash or '', password):
            return error_response("Invalid credentials", 401)

        additional_claims = {'role': user.role}
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims=additional_claims,
            expires_delta=timedelta(hours=8)
        )

        return jsonify({'access_token': access_token, 'user': user.to_dict()})

    except Exception as e:
        return error_response(str(e))


#-------------------------  STATS   --------------------------
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        Response = jsonify({"message":"logout sucessful"})
        unset_jwt_cookies(Response)
        return Response, 200

    except Exception as e:
        return error_response(str(e))


#-------------------------  PROFILE   --------------------------
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return error_response("User not found", 404)

        return jsonify({'user': user.to_dict()})

    except Exception as e:
        return error_response(str(e))


#-------------------------  UPDATE  --------------------------
@auth_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.json or {}
        user = User.query.get(user_id)

        if not user:
            return error_response("User not found", 404)

        user.name = data.get('name', user.name)

        db.session.commit()

        return jsonify({'user': user.to_dict()})

    except Exception as e:
        db.session.rollback()
        return error_response(str(e))

