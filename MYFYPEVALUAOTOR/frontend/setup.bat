@echo off
REM AI-Powered FYP Evaluator - Frontend Setup Script for Windows

echo 🎓 AI-Powered FYP Evaluator - Frontend Setup
echo =========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 14 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo ✅ npm found:
npm --version
echo.

REM Install dependencies
echo 📚 Installing dependencies...
call npm install

echo.
echo 📝 Setting up environment variables...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file
) else (
    echo ℹ️  .env file already exists
)

echo.
echo ✨ Frontend setup complete!
echo.
echo 📌 Next steps:
echo 1. Ensure backend is running at http://localhost:8000
echo 2. Run: npm start
echo 3. Open http://localhost:3000 in your browser
echo.
pause
