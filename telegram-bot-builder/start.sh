#!/bin/bash

echo "🚀 Starting Telegram Bot Builder..."
echo ""

# Проверяем, установлены ли зависимости
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "🔧 Starting servers..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Запускаем backend и frontend одновременно
trap 'kill $(jobs -p)' EXIT

cd backend && npm start &
cd frontend && npm start &

wait
