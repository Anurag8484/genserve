from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()


def init_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    
    # Configure CORS to allow frontend origins
    CORS(app, 
         origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'https://localhost:3000'],
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=True)
