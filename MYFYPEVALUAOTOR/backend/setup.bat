@echo off
REM AI-Powered FYP Evaluator - Backend Setup Script for Windows

echo 🎓 AI-Powered FYP Evaluator - Backend Setup
echo ===========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.9 or higher.
    pause
    exit /b 1
)

echo ✅ Python found: 
python --version
echo.

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo 📝 Setting up environment variables...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file - Please update with your credentials:
    echo    - OPENAI_API_KEY
    echo    - DATABASE_URL
) else (
    echo ℹ️  .env file already exists
)

echo.
echo ✨ Backend setup complete!
echo.
echo 📌 Next steps:
echo 1. Update .env with your OpenAI API key and MySQL details
echo 2. Create MySQL database: CREATE DATABASE fyp_evaluator;
echo 3. Run: python main.py
echo.
pause
