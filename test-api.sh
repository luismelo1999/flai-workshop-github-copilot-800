#!/bin/bash

# Test script for OctoFit Tracker API
# Usage: ./test-api.sh

# Get the CODESPACE_NAME or use localhost
if [ -n "$CODESPACE_NAME" ]; then
    BASE_URL="https://${CODESPACE_NAME}-8000.app.github.dev"
    echo "Testing on Codespace: $BASE_URL"
else
    BASE_URL="http://localhost:8000"
    echo "Testing on localhost: $BASE_URL"
fi

echo ""
echo "================================================"
echo "1. Testing API Root (GET $BASE_URL/api/)"
echo "================================================"
curl -s "$BASE_URL/api/" | python3 -m json.tool
echo ""

echo "================================================"
echo "2. Testing Users Endpoint (GET $BASE_URL/api/users/)"
echo "================================================"
curl -s "$BASE_URL/api/users/" | python3 -m json.tool
echo ""

echo "================================================"
echo "3. Testing Teams Endpoint (GET $BASE_URL/api/teams/)"
echo "================================================"
curl -s "$BASE_URL/api/teams/" | python3 -m json.tool
echo ""

echo "================================================"
echo "4. Testing Activities Endpoint (GET $BASE_URL/api/activities/)"
echo "================================================"
curl -s "$BASE_URL/api/activities/" | python3 -m json.tool
echo ""

echo "================================================"
echo "5. Testing Leaderboard Endpoint (GET $BASE_URL/api/leaderboard/)"
echo "================================================"
curl -s "$BASE_URL/api/leaderboard/" | python3 -m json.tool
echo ""

echo "================================================"
echo "6. Testing Workouts Endpoint (GET $BASE_URL/api/workouts/)"
echo "================================================"
curl -s "$BASE_URL/api/workouts/" | python3 -m json.tool
echo ""

echo "================================================"
echo "All API tests completed!"
echo "================================================"
