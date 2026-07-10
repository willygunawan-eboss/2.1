#!/bin/bash
set -e

echo "============================================="
echo "🚀 ICHANGEBOSS ERP Deployment Script"
echo "============================================="

echo "1️⃣ Pulling latest changes from GitHub..."
git pull origin main || true

echo "2️⃣ Installing dependencies..."
npm install --omit=dev || npm install

echo "3️⃣ Building the application..."
npm run build

echo "4️⃣ Restarting PM2 process..."
pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs

echo "5️⃣ Checking System Health..."
sleep 5
HEALTH_STATUS=$(curl -s http://localhost:3010/api/system/health || echo "FAILED")

if [[ "$HEALTH_STATUS" == *"success\":true"* ]]; then
    echo "✅ System is HEALTHY and READY!"
else
    echo "❌ System Health Check FAILED. Please review PM2 logs (pm2 logs erp-ichangeboss)."
fi

echo "============================================="
echo "🎉 Deployment Completed!"
