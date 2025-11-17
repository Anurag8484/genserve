from flask import Blueprint, jsonify, request
from extensions import db
from models.user import User
from models.product import Product
from models.ticket import Ticket
from models.agent_review import Agent_review
from utils.jwt_helper import role_required
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import SQLAlchemyError

admin_bp = Blueprint('admin', __name__)

def error_response(message="Something went wrong", status=500):
    return jsonify({"error": message}), status

#-----------------------GET ALL USERS -----------------------
@admin_bp.route('/get_all_users', methods=['GET'])
@jwt_required()
@role_required('admin')
def list_users():
    try:
        users = User.query.all()
        return jsonify([u.to_dict() for u in users])
    except Exception as e:
        return error_response(str(e))

#-------------------------  STATS   --------------------------
@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@role_required('admin')
def stats():
    try:
        total_tickets = Ticket.query.count()
        resolved = Ticket.query.filter(Ticket.status == 'Closed').count()
        products = Product.query.count()
        return jsonify({
            'total_tickets': total_tickets,
            'resolved': resolved,
            'products': products
        })
    except Exception as e:
        return error_response(str(e))

#-------------------------  GET AGENT   --------------------------
@admin_bp.route('/get_agent', methods=['POST'])
@jwt_required()
@role_required('admin')
def get_agent():
    try:
        data = request.json or {}
        user_id = data.get('user_id')

        if not user_id:
            return error_response("user_id is required", 400)

        user = User.query.get(user_id)
        if not user:
            return error_response("User not found", 404)

        return jsonify({'agent': user.to_dict()})
    except Exception as e:
        return error_response(str(e))

#-------------------------  ADD AGENT   --------------------------
@admin_bp.route('/add_agent', methods=['POST'])
@jwt_required()
@role_required('admin')
def add_agent():
    try:
        data = request.json or {}
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return error_response("email and password required", 400)

        if User.query.filter_by(email=email).first():
            return error_response("User already exists", 400)

        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            name=data.get('name'),
            role=data.get('role', 'customer'),
            specialization=data.get('specialization'),
            status=data.get('status')
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'added successfully', 'agent': user.to_dict()})

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))

#-------------------------  EDIT AGENT   --------------------------
@admin_bp.route('/edit_agent', methods=['POST'])
@jwt_required()
@role_required('admin')
def edit_agent():
    try:
        data = request.json or {}
        user = User.query.get(data.get('user_id'))

        if not user:
            return error_response("User not found", 404)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return error_response("email and password required", 400)

        user.name = data.get('name')
        user.role = data.get('role', 'customer')
        user.specialization = data.get('specialization')
        user.status = data.get('status')
        user.email = email
        user.password_hash = generate_password_hash(password)

        db.session.commit()

        return jsonify({'message': 'updated successfully', 'agent': user.to_dict()})

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))

#-------------------------  DASHBROAD   --------------------------
@admin_bp.route('/admin_dashbroad', methods=['GET'])
@jwt_required()
@role_required('admin')
def admin_dashbroad():
    try:
        result = []

        for user in User.query.all():
            u = user.to_dict()

            if u['role'] == 'internal':
                d = {
                    'agent_id': u['name'],
                    'specialization': u['specialization'],
                    'ticket_resolved': Ticket.total_resolved(u['id']),
                    'avg_time': Ticket.average_resolution_time(u['id']),
                    'rating': Agent_review.avg_rating(u['id']),
                    'feedback': Agent_review.no_feedback(u['id']),
                    'status': u['status']
                }
                result.append(d)

        return jsonify(result)

    except Exception as e:
        return error_response(str(e))

#-------------------------  CUSTOMER FEEDBACK   --------------------------
@admin_bp.route('/view_customer_feedback', methods=['GET'])
@jwt_required()
@role_required('admin')
def customer_feedback():
    try:
        feedback = Agent_review.query.all()
        return jsonify([i.to_dict() for i in feedback])

    except Exception as e:
        return error_response(str(e))
        