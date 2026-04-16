@echo off
echo Starting OCRacle Backend and Frontend...

start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm run dev"

echo Both services are booting up in separate windows!
echo - Backend: http://localhost:3001
echo - Frontend: http://localhost:3000
