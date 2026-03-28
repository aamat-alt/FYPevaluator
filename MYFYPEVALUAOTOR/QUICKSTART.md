# Quick Start Guide - AI-Powered FYP Evaluator

## ⚡ 5-Minute Quick Start

### Prerequisites
- Node.js 14+ and npm
- Python 3.9+
- MySQL 5.7+
- OpenAI API Key

### Option 1: Manual Setup

#### Backend
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Copy and configure .env
cp .env.example .env
# Edit .env - add your OPENAI_API_KEY and DATABASE_URL

# Create MySQL database
mysql -u root -p
CREATE DATABASE fyp_evaluator;
exit

# Run
python main.py
```

**Backend will run at:** `http://localhost:8000`

#### Frontend
```bash
cd frontend
npm install

# Configure .env
cp .env.example .env

# Start
npm start
```

**Frontend will run at:** `http://localhost:3000`

---

### Option 2: Docker Setup (Easiest)

```bash
# Copy Docker environment file
cp .env.example .env.docker

# Edit .env.docker with your OPENAI_API_KEY

# Start all services
docker-compose up -d

# Wait for services to be ready (30-60 seconds)
```

**Access:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

### Option 3: Automated Scripts

#### Windows
```bash
cd backend
setup.bat
cd ..\frontend
setup.bat
```

#### macOS/Linux
```bash
cd backend
bash setup.sh
cd ../frontend
bash setup.sh
```

---

## ✅ Verification Steps

1. **Backend Health Check**
   ```bash
   curl http://localhost:8000/api/health
   # Should return: {"status":"ok"}
   ```

2. **Frontend Access**
   - Open `http://localhost:3000` in browser
   - Should see home page with form

3. **API Documentation**
   - Visit `http://localhost:8000/docs`
   - Should see interactive Swagger UI

---

## 📝 First Steps After Setup

1. **Fill in .env files:**
   - Backend: Add your OpenAI API Key
   - Backend: Configure MySQL connection
   - Frontend: API URL (default is correct for local dev)

2. **Create MySQL Database:**
   ```sql
   CREATE DATABASE fyp_evaluator;
   ```

3. **Test the App:**
   - Go to `http://localhost:3000`
   - Type a FYP idea (min 50 characters)
   - Click "Evaluate My Idea"

---

## 🚀 Troubleshooting

### "Cannot connect to MySQL"
```bash
# Check MySQL is running
mysql -u root -p
# If not, start MySQL service
```

### "ModuleNotFoundError"
```bash
# Ensure virtual environment is activated
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
```

### "npm: command not found"
- Install Node.js from https://nodejs.org

### "CORS Error in browser"
- Backend is not running or wrong API URL in .env
- Check REACT_APP_API_URL in frontend/.env

---

## 📊 Running Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build --no-cache
```

---

## 📚 Next Steps

- Read [Backend README](./backend/README.md) for API details
- Read [Frontend README](./frontend/README.md) for component details
- Check [Main README](./README.md) for full documentation

---

## 🎯 Common Use Cases

### Submit Your First Idea
1. Go to `http://localhost:3000`
2. Type a project idea (min 50 chars)
3. Click "Check Similar Ideas" (optional)
4. Click "Evaluate My Idea"
5. View results

### Check Your History
1. Click "History" in navigation
2. See all evaluations
3. Click any to view details

### Use the API Directly
```bash
curl -X POST http://localhost:8000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "An AI system for analyzing student feedback and recommending interventions",
    "user_id": "student_001"
  }'
```

---

## 📱 Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8000 | http://localhost:8000 |
| MySQL | 3306 | localhost:3306 |

---

## 🔐 Security Notes

⚠️ **Development Only:**
- CORS allows all origins
- No rate limiting
- Add authentication for production

✅ **Production:**
- Use environment-specific configs
- Enable CORS restrictions
- Add rate limiting
- Use HTTPS
- Store secrets securely

---

**Happy evaluating! 🚀**

For detailed help, refer to backend/README.md or frontend/README.md
