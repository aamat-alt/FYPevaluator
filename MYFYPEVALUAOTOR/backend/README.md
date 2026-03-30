# 🎓 AI-Powered FYP Evaluator - Backend

An intelligent FastAPI-based backend for evaluating Final Year Project ideas using Google Gemini AI.

## Features

✅ **AI-Powered Evaluation** - Uses Gemini 2.5 Flash to analyze FYP ideas across 5 criteria
✅ **Similarity Detection** - Identifies similar previously submitted ideas
✅ **Database Persistence** - Stores evaluations in MySQL
✅ **RESTful API** - Clean, documented endpoints
✅ **Statistics Tracking** - Aggregates insights from all evaluations

## Tech Stack

- **Framework**: FastAPI (Python 3.9+)
- **Database**: MySQL with SQLAlchemy ORM
- **AI**: Google Gemini 2.5 Flash via google-genai package
- **HTTP Server**: Uvicorn
- **Validation**: Pydantic

## Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── config.py            # Configuration & settings
├── database.py          # Database setup & session management
├── models.py            # SQLAlchemy database models
├── schemas.py           # Pydantic request/response schemas
├── services.py          # Business logic & AI integration
├── routes.py            # API endpoints
├── requirements.txt     # Python dependencies
└── .env.example         # Environment variables template
```

## Setup Instructions

### 1. Prerequisites

- Python 3.9 or higher
- MySQL Server running
- Google Gemini API key

### 2. Clone & Install Dependencies

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE fyp_evaluator;
```

### 4. Environment Configuration

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Edit `.env`:

```
GEMINI_API_KEY=your_actual_gemini_api_key
DATABASE_URL=mysql+pymysql://root:your_password@localhost/fyp_evaluator
HOST=0.0.0.0
PORT=8000
```

### 5. Run the Server

```bash
python main.py
```

The API will start at `http://localhost:8000`

Access the interactive docs at `http://localhost:8000/docs`

## API Endpoints

### 1. POST `/api/evaluate`

**Evaluate a Final Year Project idea**

**Request:**
```json
{
  "idea": "Build an AI chatbot for university counseling with sentiment analysis...",
  "user_id": "user_123"
}
```

**Response:**
```json
{
  "idea_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user_123",
  "idea_text": "Build an AI chatbot...",
  "scores": {
    "uniqueness": 8,
    "feasibility": 7,
    "problem_solving_value": 9,
    "complexity": "High",
    "domain": "AI/NLP"
  },
  "overall_score": 8.0,
  "strengths": ["Novel approach", "High impact"],
  "weaknesses": ["Complex implementation"],
  "improvement_suggestions": ["Focus on dataset collection"],
  "created_at": "2024-03-28T10:30:00"
}
```

### 2. GET `/api/history/{user_id}`

**Get all evaluations for a user**

**Response:**
```json
{
  "evaluations": [...],
  "total_count": 5
}
```

### 3. GET `/api/ideas/similar?idea={text}`

**Find similar previously submitted ideas**

**Response:**
```json
{
  "similar_ideas": [
    {
      "idea_id": "...",
      "idea_text": "...",
      "overall_score": 7.5,
      "domain": "AI",
      "created_at": "2024-03-27T..."
    }
  ],
  "count": 3
}
```

### 4. GET `/api/evaluations/stats`

**Get global statistics**

**Response:**
```json
{
  "total_ideas_submitted": 42,
  "average_uniqueness_score": 7.2,
  "average_feasibility_score": 6.8,
  "average_problem_solving_score": 7.5,
  "average_overall_score": 7.2,
  "most_common_domains": ["AI", "Web Dev", "IoT"]
}
```

### 5. GET `/api/health`

**Health check**

**Response:**
```json
{
  "status": "ok"
}
```

## Database Schema

### evaluations table

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) | UUID Primary Key |
| user_id | VARCHAR(36) | User identifier (indexed) |
| idea_text | TEXT | The FYP idea description |
| uniqueness_score | INTEGER | 0-10 score |
| feasibility_score | INTEGER | 0-10 score |
| problem_solving_value | INTEGER | 0-10 score |
| complexity | VARCHAR(20) | Low / Medium / High |
| domain | VARCHAR(100) | Domain classification |
| overall_score | FLOAT | Average of main scores |
| strengths | JSON | Array of strings |
| weaknesses | JSON | Array of strings |
| improvement_suggestions | JSON | Array of strings |
| created_at | DATETIME | Timestamp (auto-set) |

## AI Evaluation Criteria

The AI evaluates ideas on:

1. **Uniqueness (0-10)** - How original and innovative
2. **Technical Feasibility (0-10)** - Realistic implementation within timeframe
3. **Problem-Solving Value (0-10)** - Real problem solved & practical impact
4. **Complexity Level** - Low / Medium / High classification
5. **Domain Classification** - AI, EdTech, Web Dev, IoT, etc.

## Error Handling

Common errors:

- `400 Bad Request` - Idea too short (< 50 characters)
- `400 Bad Request` - Gemini API returned invalid JSON
- `500 Internal Server Error` - Gemini API error

## Development

### Running in Debug Mode

```bash
python main.py
# Uvicorn will auto-reload on file changes
```

### Adding New Endpoints

1. Add schema in `schemas.py`
2. Add logic in `services.py`
3. Add route in `routes.py`
4. Include in `main.py`

## Security Notes

⚠️ **Production Deployment:**
- Restrict CORS origins to your frontend domain
- Use environment-specific configs
- Validate all inputs
- Rate limit the `/evaluate` endpoint
- Never commit `.env` files

## Troubleshooting

**"ModuleNotFoundError"**
- Ensure venv is activated
- Run `pip install -r requirements.txt`

**"Access denied for user 'root'@'localhost'"**
- Check DATABASE_URL in .env
- Verify MySQL credentials

**"Gemini API Error"**
- Verify GEMINI_API_KEY is correct in .env
- Check your Google Cloud API key has Gemini API enabled
- Ensure gemini-2.5-flash model is available in your API key
- Check API quota limits

---

**Built with ❤️ for FYP success!**
