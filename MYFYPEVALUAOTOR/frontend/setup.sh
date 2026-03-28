#!/bin/bash

# AI-Powered FYP Evaluator - Frontend Setup Script
# This script sets up the frontend environment

echo "🎓 AI-Powered FYP Evaluator - Frontend Setup"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📚 Installing dependencies..."
npm install

echo ""
echo "📝 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "✨ Frontend setup complete!"
echo ""
echo "📌 Next steps:"
echo "1. Ensure backend is running at http://localhost:8000"
echo "2. Run: npm start"
echo "3. Open http://localhost:3000 in your browser"
echo ""
