from extensions import db
from datetime import datetime
from sqlalchemy import func

class Ticket(db.Model):
    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='Open')
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    closed_at = db.Column(db.DateTime, nullable=True)
    pickup_date = db.Column(db.DateTime, nullable=True)
    preferred_time_slot = db.Column(db.String(30))
    contact = db.Column(db.String(30))
    pickup_address = db.Column(db.Text)
    


    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'status': self.status,
            'customer_id': self.customer_id,
            'product_id': self.product_id,
            'assigned_to': self.assigned_to,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'closed_at': self.closed_at.isoformat() if self.closed_at else None,
            "pickup_date" : self.pickup_date.isoformat() if self.pickup_date else None,
            "preferred_time_slot" : self.preferred_time_slot,
            "contact" : self.contact,
            "pickup_address" : self.pickup_address
        }
    
    @classmethod
    def average_resolution_time(cls, user_id):
        
        avg_diff = (
            db.session.query(
                func.avg(func.extract('epoch', cls.closed_at - cls.created_at))
            )
            .filter(cls.assigned_to == user_id)
            .filter(cls.closed_at.isnot(None))   # only closed tickets
            .scalar()
        )

        if avg_diff:
            return avg_diff/3600  # seconds
        return 0
    
    @classmethod
    def total_resolved(cls, user_id):

        total=db.session.query(cls).filter(cls.assigned_to == user_id).filter(cls.closed_at.isnot(None)).count()
        if total:
            return total  # seconds
        return 0
