from flask import Blueprint, request, jsonify
from extensions import db
from models.ticket import Ticket
from models.product import Product
from models.faq import Faq
from models.agent_review import Agent_review
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from utils.jwt_helper import role_required
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

tickets_bp = Blueprint('tickets', __name__)

def error_response(message="Something went wrong", status=500):
    return jsonify({"error": message}), status


@tickets_bp.route('/get_all_ticket', methods=['GET'])
@jwt_required()
def list_user_tickets():
    try:
        claims = get_jwt()
        uid = get_jwt_identity()
        role = claims.get('role')

        if role in ['admin', 'internal']:
            items = Ticket.query.all()
        else:
            items = Ticket.query.filter_by(customer_id=uid).all()

        return jsonify([t.to_dict() for t in items])

    except Exception as e:
        return error_response(str(e))


# ------------------ CREATE TICKET ------------------
@tickets_bp.route('/create', methods=['POST'])
@jwt_required()
def create_ticket():
    try:
        uid = get_jwt_identity()
        data = request.json or {}

        # Required fields validation
        if not data.get("description"):
            return error_response("description is required", 400)
        if not data.get("customer_id"):
            return error_response("customer_id is required", 400)

        pickup_date_str = data.get("pickup_date")

        try:
            pickup = datetime.fromisoformat(pickup_date_str) if pickup_date_str else None
        except ValueError:
            return error_response("Invalid pickup_date format, must be ISO format", 400)

        ticket = Ticket(
            id=data.get("id"),
            description=data.get("description"),
            status=data.get("status", "Open"),
            customer_id=data.get("customer_id"),
            product_id=data.get("product_id"),
            assigned_to=data.get("assigned_to"),
            pickup_date=pickup,
            preferred_time_slot=data.get("preferred_time_slot"),
            contact=data.get("contact"),
            pickup_address=data.get("pickup_address")
        )

        db.session.add(ticket)
        db.session.commit()

        return jsonify({'ticket': ticket.to_dict()}), 201

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))



# ------------------ GET SINGLE TICKET ------------------
@tickets_bp.route('/get_ticket/<int:id>', methods=['GET'])
@jwt_required()
def get_ticket(id):
    try:
        t = Ticket.query.get(id)
        if not t:
            return error_response("Ticket not found", 404)
        return jsonify(t.to_dict())

    except Exception as e:
        return error_response(str(e))



# ------------------ UPDATE STATUS ------------------
@tickets_bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
@role_required('internal', 'admin')
def update_status(id):
    try:
        t = Ticket.query.get(id)
        if not t:
            return error_response("Ticket not found", 404)

        data = request.json or {}
        t.status = data.get("status", t.status)

        db.session.commit()
        return jsonify({'ticket': t.to_dict()})

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))



# ------------------ CLOSE TICKET ------------------
@tickets_bp.route('/<int:id>/close', methods=['PUT'])
@jwt_required()
def close_ticket(id):
    try:
        uid = get_jwt_identity()
        t = Ticket.query.get(id)

        if not t:
            return error_response("Ticket not found", 404)

        if t.customer_id != uid:
            return error_response("not allowed", 403)

        t.status = "Closed"
        t.closed_at = datetime.utcnow()
        db.session.commit()

        return jsonify({'ticket': t.to_dict()})

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))



# ------------------ PRODUCT HISTORY ------------------
@tickets_bp.route('/history/<int:productId>', methods=['GET'])
@jwt_required()
def history(productId):
    try:
        tickets = Ticket.query.filter_by(product_id=productId).all()
        return jsonify([t.to_dict() for t in tickets])
    except Exception as e:
        return error_response(str(e))



# ------------------ SUBMIT REVIEW ------------------
@tickets_bp.route('/review', methods=['POST'])
@jwt_required()
def review():
    try:
        data = request.json or {}

        if not data.get("rating"):
            return error_response("rating is required", 400)

        r = Agent_review(
            id=data.get("id"),
            rating=data.get("rating"),
            feedback=data.get("feedback"),
            user_id=data.get("user_id"),
            ticket_id=data.get("ticket_id")
        )

        db.session.add(r)
        db.session.commit()

        return jsonify({"message": "successfully added"})

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))


# ------------------ ADD FAQ ------------------
@tickets_bp.route('/add_faq', methods=['POST'])
@jwt_required()
@role_required('internal', 'admin')
def add_faq():
    try:
        data = request.json or {}

        if not data.get("question") or not data.get("answer"):
            return error_response("question and answer are required", 400)

        faq = Faq(question=data.get("question"), answer=data.get("answer"))

        db.session.add(faq)
        db.session.commit()

        return jsonify({"message": "successfully added"})

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))


# ------------------ GET FAQ ------------------
@tickets_bp.route('/get_faq', methods=['GET'])
@jwt_required()
def get_faq():
    try:
        faqs = Faq.query.all()
        return jsonify([f.to_dict() for f in faqs])
    except Exception as e:
        return error_response(str(e))




