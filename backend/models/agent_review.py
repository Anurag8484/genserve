from extensions import db
from sqlalchemy import func

class Agent_review(db.Model):
    __tablename__ = 'agent_review'
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=True)

    def to_dict(self):
        return{
            "id" : self.id,
            "rating" : self.rating,
            "feedback" : self.feedback,
            "user_id" : self.user_id,
            "ticket_id" : self.ticket_id
        }
    @classmethod
    def avg_rating(cls,user_id):

        ar = (
            db.session.query(
                func.avg(cls.rating)
            )
            .filter(cls.user_id == user_id)   
            .scalar()
        )
        if ar:
            return ar
        return 0
    
    @classmethod
    def no_feedback(cls,user_id):
        return (
            db.session.query(cls)
            .filter(cls.user_id == user_id)   
            .count()
        )
