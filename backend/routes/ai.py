from flask import Blueprint, request, jsonify
from utils.ai_client import ask_ai_faq
from flask_jwt_extended import jwt_required
from models.faq import Faq

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


#-------------------------  AI CHAT TEST   --------------------------
@ai_bp.route('/chat_test', methods=['POST'])
def chat_test():
    """Test endpoint for AI chat without authentication"""
    try:
        data = request.json or {}
        message = data.get('query')

        if not message:
            return jsonify({"error": "query is required"}), 400

        print(f"AI Chat Test - Received message: {message}")

        # Try AI FAQ call, fallback to simple response if it fails
        try:
            resp = ask_ai_faq(message)
            print(f"AI response: {resp}")
            return jsonify(resp)
        except Exception as ai_err:
            print(f"AI processing failed: {str(ai_err)}")
            # Fallback to simple response based on keywords
            fallback_response = get_fallback_response(message.lower())
            return jsonify({"response": fallback_response})

    except Exception as e:
        return jsonify({"error": "Something went wrong", "details": str(e)}), 500


def get_fallback_response(message):
    """Provide fallback responses when AI is not available"""
    if any(word in message for word in ['hello', 'hi', 'hey']):
        return "Hello! I'm here to help with your technical support questions. How can I assist you today?"
    
    elif any(word in message for word in ['battery', 'charging']):
        return "For battery and charging issues, please check if the charging cable is properly connected. Try using a different charger if available. If the issue persists, you can create a support ticket for further assistance."
    
    elif any(word in message for word in ['screen', 'display']):
        return "For screen or display issues, try restarting your device first. Check if the issue occurs in different apps or only specific ones. If the problem continues, please create a support ticket with details about when the issue started."
    
    elif any(word in message for word in ['slow', 'performance']):
        return "For performance issues, try closing unused apps and restarting your device. Check available storage space. If your device continues to be slow, consider creating a support ticket for hardware diagnosis."
    
    elif any(word in message for word in ['ticket', 'support', 'help']):
        return "You can create a support ticket by clicking 'Create New Ticket' on the dashboard. This will help us track and resolve your issue efficiently. Our support team typically responds within 24 hours."
    
    elif any(word in message for word in ['warranty', 'repair']):
        return "For warranty and repair information, please check your device's warranty status in your account. Most repairs are covered under standard warranty for the first year. You can schedule a pickup for diagnosis through our support system."
    
    else:
        return "I understand you need help with your device. For the best assistance, I recommend creating a support ticket with specific details about your issue. Our technical team can provide personalized solutions for your problem."


#-------------------------  GET ALL FAQ   --------------------------
@ai_bp.route('/faq/get_all_faq', methods=['GET'])
def get_all_faq():
    """Get all FAQs without authentication"""
    try:
        faqs = Faq.query.all()
        return jsonify([f.to_dict() for f in faqs])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
