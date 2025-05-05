#!/bin/bash

echo "🟡 Deploy application"
set -e

echo "🟡 Pulling code"
git pull origin main

echo "🟡 Building project"
docker compose up -d --build
docker image prune --force
