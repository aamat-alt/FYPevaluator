#!/bin/bash

# AI-Powered FYP Evaluator - Backend Setup Script
# This script sets up the backend environment

echo "🎓 AI-Powered FYP Evaluator - Backend Setup"
echo "==========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "📝 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file - Please update with your credentials:"
    echo "   - OPENAI_API_KEY"
    echo "   - DATABASE_URL"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "✨ Backend setup complete!"
echo ""
echo "📌 Next steps:"
echo "1. Update .env with your OpenAI API key and MySQL details"
echo "2. Create MySQL database: CREATE DATABASE fyp_evaluator;"
echo "3. Run: python main.py"
echo ""
