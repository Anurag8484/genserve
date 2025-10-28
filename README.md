⚙️ GenServe — Customer Service App

A simple Customer Service Web Application for electronic products (Mobiles, Laptops, TVs, Refrigerators).
Supports customers, internal staff, and admins with ticket management, FAQs, live chat, and service tracking.

🧠 Tech Stack

- Frontend: React (Vite + JavaScript)
- Backend: Python (Flask)
- Database: PostgreSQL
- Optional: GenAI Integration (for automated troubleshooting)

📁 Proposed Folder Structure
```
genserve/
│
├── backend/                  # Flask Backend
│   ├── app.py
│   ├── requirements.txt
│   ├── venv/
│   ├── models/
│   ├── routes/
│   ├── static/
│   ├── templates/
│   └── .env
│
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── package.json
│   └── .env
│
└── README.md
```

🧩 Getting Started (For All Team Members)

Follow these steps after forking the repository 👇

1️⃣ Clone Your Fork
```
git clone https://github.com/<your-username>/genserve.git
cd genserve
```

🐍 Backend Setup (Flask)
Step 1: Go to backend folder
```
cd backend
```
Step 2: Create Virtual Environment
```
python3 -m venv venv
```
Step 3: Activate Virtual Environment
```
source venv/bin/activate
```

Step 4: Upgrade pip and install dependencies
```
python3 -m pip install --upgrade pip
pip install -r requirements.txt
```

Step 5: Run Flask Server
```
uvicorn main:app --reload

```


Server will start at 👉 http://127.0.0.1:8000

⚛️ Frontend Setup (React)
Step 1: Go to frontend folder
```
cd ../frontend
```
Step 2: Install dependencies
```
npm install
```
Step 3: Start the app
```
npm run dev
```

App will start at 👉 http://localhost:5173

🔄 Connect Frontend + Backend

Add this inside frontend/.env:
```
BACKEND_URL=http://127.0.0.1:8000
```

Use it in API calls:
```
const API = import.meta.env.BACKEND_URL;
fetch(`${API}/tickets`);
```
🧑‍💻 Workflow

- Fork the repo.

- Clone your fork locally.

- Create a new branch:
```
git checkout -b feature/<your-feature-name>
```

- Make your changes → commit → push:
```
git add .
git commit -m "Added <feature-name>"
git push origin feature/<your-feature-name>
```

- Open a Pull Request (PR) to the main repo.

- Wait for review and merge by Anurag ✅

🧾 Notes

- Use venv for Python dependencies (don’t commit it).

- Don’t push .env or node_modules/ folders.

- Keep commit messages short and meaningful.

- Use branches for every feature (never commit to main directly).
