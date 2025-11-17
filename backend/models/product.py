from extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    model = db.Column(db.String(100))
    description = db.Column(db.Text)
 

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'model': self.model,
            'description': self.description,
        }
