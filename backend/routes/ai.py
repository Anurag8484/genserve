from flask import Blueprint, request, jsonify
from utils.ai_client import ask_ai_faq
from flask_jwt_extended import jwt_required

ai_bp = Blueprint('ai', __name__)


#-------------------------  AI CHAT   --------------------------
@ai_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        data = request.json or {}

        message = data.get('query')

        # Validate request

        if not message:
            return jsonify({"error": "query is required"}), 400

        # AI FAQ call
        try:
            resp = ask_ai_faq(message)
        except Exception as ai_err:
            return jsonify({"error": f"AI processing failed: {str(ai_err)}"}), 500

        return jsonify(resp)

    except Exception as e:
        # general fallback error
        return jsonify({"error": "Something went wrong", "details": str(e)}), 500
