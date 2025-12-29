#!/bin/bash

echo "=== Testing Signup ==="
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nith.ac.in","password":"password123456"}'

echo -e "\n\n=== Testing Login ==="
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nith.ac.in","password":"password123456"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

echo -e "\n\n=== Creating Post ==="
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Post","content":"Hello from bash!","category":"General"}'

echo -e "\n\n=== Getting All Posts ==="
curl http://localhost:5000/api/posts