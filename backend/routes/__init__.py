from .auth import auth_bp
from .products import products_bp
from .tickets import tickets_bp
from .ai import ai_bp
from .admin import admin_bp
from .orders import orders_bp



def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(tickets_bp, url_prefix='/api/tickets')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')

