#!/bin/bash

echo "=== DEPLOY DASHBOARD INDUSTRI PARIWISATA (NO NGINX) ==="

PROJECT_DIR="/root/projects/dashboard-industri-pariwisata"
APP_NAME="dashboard-pariwisata"
PORT=3001

cd $PROJECT_DIR || exit

echo "→ Installing dependencies..."
npm install

echo "→ Building production..."
npm run build

echo "→ Restarting PM2 app on port $PORT ..."
pm2 delete $APP_NAME 2>/dev/null

pm2 start "npm start -- -p $PORT" --name $APP_NAME

echo "→ Saving PM2 state..."
pm2 save

echo "=== DEPLOY COMPLETE ==="
echo "App running at: http://YOUR_SERVER_IP:$PORT"