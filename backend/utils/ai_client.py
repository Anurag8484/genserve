import os
from openai import OpenAI
from dotenv import load_dotenv
from .faq_memory import FAQ_MEMORY

load_dotenv()  # load .env variables

# Load your OpenRouter API key from .env
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")

# Configure OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_KEY
)




def ask_ai_faq(query):
    faq_context = "\n\n".join(
            [f"Q: {f['question']}\nA: {f['answer']}" for f in FAQ_MEMORY]
        )
    print(faq_context)
    SYSTEM_PROMPT = f"""
You are a strict customer support chatbot.

You must ONLY handle:
- product issues
- billing issues
- account support
- troubleshooting
- refunds, returns, and order-related questions

Below is the FAQ knowledge base:
{faq_context}

User asked: "{query}"

Your rules:
1. First check if the user's question MATCHES or is SIMILAR to any FAQ.
2. If it matches, reply ONLY with the FAQ answer.
3. If not in the FAQ, generate your own correct customer-support answer.
4. If the query is NOT related to customer support, reply exactly:
   "I can assist only with customer support–related queries."
"""
    try:

        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",   # FREE MODEL
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                

            ]
        )
        return response.choices[0].message.content

    except Exception as e:
        # Prevent Flask from crashing
        return {"error": f"AI request failed: {str(e)}"}
