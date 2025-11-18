from extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    model = db.Column(db.String(100))
    category = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    price = db.Column(db.Float)
    description = db.Column(db.Text)
 

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'model': self.model,
            'category': self.category,
            'brand': self.brand,
            'price': self.price,
            'description': self.description,
        }
