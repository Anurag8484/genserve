from extensions import db

class Faq(db.Model):
    __tablename__ = 'faq'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    question = db.Column(db.String(100))
    answer = db.Column(db.String(100))
    

    def to_dict(self):
        return{
            "id" : self.id,
            "question" : self.question,
            "answer" : self.answer,
            
        }
