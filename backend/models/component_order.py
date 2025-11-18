from extensions import db
from datetime import datetime

class ComponentOrder(db.Model):
    __tablename__ = 'component_orders'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50), unique=True, nullable=False)  # P-1234 format
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=True)
    device_type = db.Column(db.String(50), nullable=False)  # mobile, tv, laptop
    component_name = db.Column(db.String(200), nullable=False)  # Battery, Screen, etc.
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(50), default='Ordered')  # Ordered, Shipped, Delivered
    service_tier = db.Column(db.String(50), default='Gold')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now)
    shipped_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    customer = db.relationship('User', foreign_keys=[customer_id], backref='component_orders', lazy=True)
    ticket = db.relationship('Ticket', foreign_keys=[ticket_id], backref='component_orders', lazy=True)

    def to_dict(self):
        # Import here to avoid circular imports
        from models.ticket import Ticket
        ticket_data = None
        if self.ticket_id:
            ticket = Ticket.query.get(self.ticket_id)
            if ticket:
                ticket_data = {
                    'id': ticket.id,
                    'description': ticket.description,
                    'status': ticket.status
                }
        
        return {
            'id': self.id,
            'order_id': self.order_id,
            'customer_id': self.customer_id,
            'ticket_id': self.ticket_id,
            'ticket': ticket_data,
            'device_type': self.device_type,
            'component_name': self.component_name,
            'quantity': self.quantity,
            'price': self.price,
            'status': self.status,
            'service_tier': self.service_tier,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'shipped_at': self.shipped_at.isoformat() if self.shipped_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
        }