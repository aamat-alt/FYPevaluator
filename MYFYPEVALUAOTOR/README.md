# AI-Powered FYP Evaluator

## 🎓 Overview

A full-stack intelligent decision support system that helps university students evaluate their **Final Year Project (FYP)** ideas using AI. The system provides structured feedback on five key criteria and learns from previous submissions to improve uniqueness assessments.

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Configure .env with your Google Gemini API key and MySQL details
cp .env.example .env

# Run
python main.py
```

Backend will start at: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install

# Configure .env
cp .env.example .env

# Run
npm start
```

Frontend will start at: `http://localhost:3000`

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router, Axios, Tailwind CSS |
| **Backend** | FastAPI, Python 3.9+, Uvicorn |
| **Database** | MySQL, SQLAlchemy ORM |
| **AI** | Google Gemini 2.5 Flash (via google-genai) |
| **API** | RESTful with Pydantic validation |

## 📊 Features

### AI Evaluation Engine
- Evaluates FYP ideas on **5 criteria** (each 0-10):
  - **Uniqueness** - How original and innovative
  - **Technical Feasibility** - Realistic implementation
  - **Problem-Solving Value** - Impact and practical use
  - **Complexity Level** - Low / Medium / High
  - **Domain Classification** - AI, EdTech, Web Dev, etc.

### Smart Features
- ⚡ **Similarity Detection** - Identifies similar previously submitted ideas
- 📊 **Learning System** - Context from similar ideas informs uniqueness scores
- 📈 **Statistics** - Aggregate insights from all submissions
- 💾 **Persistence** - All evaluations stored in MySQL
- 🔄 **History Tracking** - Students can review all past evaluations
- 📱 **Responsive Design** - Works on desktop and mobile

### User Experience
- 🎨 Clean, modern Tailwind CSS interface
- ⏱️ Real-time character counter for idea submission
- 🔍 Pre-submission similarity warnings
- 📄 Beautiful results dashboard with visual scores
- 📚 Searchable evaluation history with detailed modals
- ⚠️ Error handling with user-friendly messages

## 📁 Project Structure

```
MYFYPEVALUAOTOR/
├── backend/                   # FastAPI backend
│   ├── main.py               # App entry point
│   ├── config.py             # Configuration
│   ├── database.py           # DB setup
│   ├── models.py             # SQLAlchemy models
│   ├── schemas.py            # Pydantic schemas
│   ├── services.py           # Business logic
│   ├── routes.py             # API endpoints
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── frontend/                  # React frontend
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API & utilities
    │   ├── App.jsx
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── .env.example
    └── README.md
```

## 🔌 API Endpoints

### Evaluation
- **POST** `/api/evaluate` - Evaluate a new FYP idea
- **GET** `/api/history/{user_id}` - Get user's evaluation history
- **GET** `/api/ideas/similar?idea={text}` - Find similar ideas
- **GET** `/api/evaluations/stats` - Get global statistics
- **GET** `/api/health` - Health check

## 📦 Database Schema

### evaluations table
```sql
CREATE TABLE evaluations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    idea_text TEXT NOT NULL,
    uniqueness_score INTEGER,
    feasibility_score INTEGER,
    problem_solving_value INTEGER,
    complexity VARCHAR(20),
    domain VARCHAR(100),
    overall_score FLOAT,
    strengths JSON,
    weaknesses JSON,
    improvement_suggestions JSON,
    created_at DATETIME,
    INDEX idx_user_id (user_id)
);
```

## 🔐 Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=mysql+pymysql://root:password@localhost/fyp_evaluator
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
```

## 📖 Usage Examples

### Submit an Idea (Frontend)

1. Navigate to Home page
2. Type FYP idea (minimum 50 characters)
3. Optionally check for similar ideas first
4. Click "Evaluate My Idea"
5. View results with scores and recommendations

### Check History

1. Click "History" in navigation
2. See all past evaluations in a table
3. Click any evaluation to view full details
4. Review strengths, weaknesses, and suggestions

### API Usage (Backend)

```bash
# Evaluate an idea
curl -X POST http://localhost:8000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "Build an AI chatbot for university counseling with NLP and sentiment analysis capabilities",
    "user_id": "user_123"
  }'

# Get user history
curl http://localhost:8000/api/history/user_123

# Find similar ideas
curl "http://localhost:8000/api/ideas/similar?idea=AI%20chatbot%20project"

# Get statistics
curl http://localhost:8000/api/evaluations/stats
```

## 🛠️ Development

### Start both services (concurrent)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Database Setup

```sql
CREATE DATABASE fyp_evaluator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The tables will auto-create when you run the backend first time.

## 🚀 Production Deployment

### Backend (example with Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

### Frontend (example with Vercel)
```bash
npm run build
vercel deploy --prod
```

## 📝 Response Format

### Evaluation Response
```json
{
  "idea_id": "uuid",
  "user_id": "user_123",
  "idea_text": "...",
  "scores": {
    "uniqueness": 8,
    "feasibility": 7,
    "problem_solving_value": 9,
    "complexity": "High",
    "domain": "AI/NLP"
  },
  "overall_score": 8.0,
  "strengths": ["Innovative approach", "High impact"],
  "weaknesses": ["Complex implementation"],
  "improvement_suggestions": ["Focus on data collection", "Plan MVP carefully"],
  "created_at": "2024-03-28T10:30:00"
}
```

## ⚠️ Important Notes

### Prerequisites
- Python 3.9+ for backend
- Node.js 14+ for frontend
- MySQL 5.7+ for database
- Google Gemini API key (get from Google AI Studio)

### CORS Configuration
- Development: All origins allowed
- Production: Configure specific frontend domain

### Rate Limiting
- Consider implementing rate limits on `/evaluate` endpoint for production
- Gemini API has rate limits - monitor usage

### Security
- Never commit `.env` files
- Store secrets in environment variables
- Validate all user inputs
- Use HTTPS in production

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| "Cannot connect to MySQL" | Check DATABASE_URL, ensure MySQL is running |
| "Gemini API Error" | Verify GEMINI_API_KEY, check API quota and model access |
| "CORS Error" | Backend CORS middleware needs adjustment |
| "npm: command not found" | Install Node.js |
| "python: command not found" | Install Python 3.9+ |

## 📚 Documentation

- **[Backend README](./backend/README.md)** - Detailed backend documentation
- **[Frontend README](./frontend/README.md)** - Detailed frontend documentation

## 🎯 Future Enhancements

- [ ] User authentication and profiles
- [ ] Export evaluations as PDF
- [ ] Comparison between multiple ideas
- [ ] Peer feedback and community ratings
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Mentor/supervisor interface
- [ ] Integration with university management systems

## 📄 License

MIT License - Feel free to use for educational purposes

## 👥 Contributors

Built with ❤️ for FYP success!

---

**Need Help?** Check the README files in individual folder or create an issue.
