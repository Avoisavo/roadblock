#!/bin/bash
set -e

APP_DIR="/root/roadblock"

cd "$APP_DIR"

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm ci

echo "Building Next.js app..."
npm run build

echo "Restarting PM2 process..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

echo "Deployment complete."
