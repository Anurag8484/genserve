from flask import Blueprint, request, jsonify
from extensions import db
from models.component_order import ComponentOrder
from models.ticket import Ticket
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from utils.jwt_helper import role_required
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
import random

orders_bp = Blueprint('orders', __name__)

def error_response(message="Something went wrong", status=500):
    return jsonify({"error": message}), status


@orders_bp.route('/get_all_orders', methods=['GET'])
@jwt_required()
def list_user_orders():
    try:
        claims = get_jwt()
        uid = get_jwt_identity()
        role = claims.get('role')

        if role in ['admin', 'internal']:
            orders = ComponentOrder.query.all()
        else:
            orders = ComponentOrder.query.filter_by(customer_id=uid).all()

        return jsonify([order.to_dict() for order in orders])

    except Exception as e:
        return error_response(str(e))


@orders_bp.route('/test_orders', methods=['GET'])
def test_orders():
    """Test endpoint to return orders without authentication"""
    try:
        # Get all orders from database
        orders = ComponentOrder.query.all()
        
        # If no orders in database, return mock data
        if not orders:
            mock_orders = [
                {
                    "id": 1,
                    "order_id": "P-1234",
                    "customer_id": 1,
                    "ticket_id": 1,
                    "device_type": "mobile",
                    "component_name": "Battery",
                    "quantity": 1,
                    "price": 49.99,
                    "status": "Active",
                    "service_tier": "Gold",
                    "created_at": "2025-11-17T10:00:00Z",
                    "ticket": {
                        "id": 1,
                        "description": "Battery draining fast",
                        "status": "In Service"
                    }
                }
            ]
            return jsonify(mock_orders)
        
        # Return actual orders from database
        return jsonify([order.to_dict() for order in orders])

    except Exception as e:
        return error_response(str(e))


@orders_bp.route('/create', methods=['POST'])
@jwt_required()
def create_order():
    try:
        uid = get_jwt_identity()
        data = request.json or {}

        # Required fields validation
        if not data.get("device_type"):
            return error_response("device_type is required", 400)
        if not data.get("component_name"):
            return error_response("component_name is required", 400)

        # Generate order ID
        order_id = f"P-{random.randint(1000, 9999)}"

        # Component pricing (mock pricing)
        component_prices = {
            "mobile": {"Battery": 49.99, "Screen": 129.99, "Charging Port": 29.99, "Speaker": 39.99, "Microphone": 24.99},
            "tv": {"Power Supply": 89.99, "HDMI Port": 59.99, "Remote Control": 19.99, "Backlight": 149.99, "Main Board": 199.99},
            "laptop": {"Hard Drive": 99.99, "RAM": 79.99, "Battery": 69.99, "Keyboard": 49.99, "Display Panel": 249.99}
        }
        
        device_type = data.get("device_type")
        component_name = data.get("component_name")
        price = component_prices.get(device_type, {}).get(component_name, 50.0)

        order = ComponentOrder(
            order_id=order_id,
            customer_id=uid,
            ticket_id=data.get("ticket_id"),
            device_type=device_type,
            component_name=component_name,
            quantity=data.get("quantity", 1),
            price=price,
            status=data.get("status", "Ordered"),
            service_tier=data.get("service_tier", "Gold"),
            notes=data.get("notes")
        )

        db.session.add(order)
        db.session.commit()

        return jsonify({'order': order.to_dict()}), 201

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))


@orders_bp.route('/test_create', methods=['POST'])
def test_create_order():
    """Test endpoint to create orders without authentication"""
    try:
        data = request.json or {}

        # Required fields validation
        if not data.get("device_type"):
            return error_response("device_type is required", 400)
        if not data.get("component_name"):
            return error_response("component_name is required", 400)

        # Use a default customer ID for testing
        customer_id = 1  # Default test customer

        # Generate order ID
        order_id = f"P-{random.randint(1000, 9999)}"

        # Component pricing (mock pricing)
        component_prices = {
            "mobile": {"Battery": 49.99, "Screen": 129.99, "Charging Port": 29.99, "Speaker": 39.99, "Microphone": 24.99},
            "tv": {"Power Supply": 89.99, "HDMI Port": 59.99, "Remote Control": 19.99, "Backlight": 149.99, "Main Board": 199.99},
            "laptop": {"Hard Drive": 99.99, "RAM": 79.99, "Battery": 69.99, "Keyboard": 49.99, "Display Panel": 249.99}
        }
        
        device_type = data.get("device_type")
        component_name = data.get("component_name")
        price = component_prices.get(device_type, {}).get(component_name, 50.0)

        # Convert ticket_id if provided
        ticket_id = None
        if data.get("ticket_id"):
            try:
                # Remove 'ticket-' prefix if present and convert to int
                ticket_str = str(data.get("ticket_id")).replace('ticket-', '')
                ticket_id = int(ticket_str)
            except (ValueError, TypeError):
                pass

        print(f"Creating order: device={device_type}, component={component_name}, ticket_id={ticket_id}, price={price}")

        order = ComponentOrder(
            order_id=order_id,
            customer_id=customer_id,
            ticket_id=ticket_id,
            device_type=device_type,
            component_name=component_name,
            quantity=data.get("quantity", 1),
            price=price,
            status=data.get("status", "Active"),  # Use "Active" to match frontend expectations
            service_tier=data.get("service_tier", "Gold"),
            notes=data.get("notes")
        )

        db.session.add(order)
        db.session.commit()

        return jsonify({'order': order.to_dict()}), 201

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))


@orders_bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
@role_required('internal', 'admin')
def update_order_status(id):
    try:
        order = ComponentOrder.query.get(id)
        if not order:
            return error_response("Order not found", 404)

        data = request.json or {}
        status = data.get("status")
        
        if status:
            order.status = status
            if status == "Shipped" and not order.shipped_at:
                order.shipped_at = datetime.utcnow()
            elif status == "Delivered" and not order.delivered_at:
                order.delivered_at = datetime.utcnow()

        db.session.commit()
        return jsonify({'order': order.to_dict()})

    except SQLAlchemyError as db_err:
        db.session.rollback()
        return error_response(str(db_err))
    except Exception as e:
        return error_response(str(e))