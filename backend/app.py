from flask import Flask, jsonify
from config import Config
from extensions import init_extensions, db
from routes import register_routes
from utils.faq_memory import load_faq_into_memory

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    init_extensions(app)

    # Create DB models if using sqlite for quick demo
    with app.app_context():
        db.create_all()
        load_faq_into_memory()

    register_routes(app)

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
