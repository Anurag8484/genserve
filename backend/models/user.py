from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)
    name = db.Column(db.String(120))
    role = db.Column(db.String(32), default='customer')  # customer, internal, admin
    specialization = db.Column(db.String(100))
    status = db.Column(db.String(50), default='inactive')
    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'specialization' : self.specialization,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
