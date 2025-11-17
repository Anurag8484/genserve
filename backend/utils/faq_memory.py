from models.faq import Faq

FAQ_MEMORY = [] 

def load_faq_into_memory():
    faqs = Faq.query.all()
    FAQ_MEMORY.clear()

    for f in faqs:
        FAQ_MEMORY.append({
            "question": f.question,
            "answer": f.answer
        })