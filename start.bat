@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo  HEALTH INSURANCE DASHBOARD LAUNCHER
echo ========================================
echo.

echo [1/3] Starting Go Backend...
start "Go Backend" cmd /k "cd /d backend && go run main.go"

echo Waiting for Go to initialize (3 seconds)...
timeout /t 3 /nobreak >nul

echo [2/3] Starting React Frontend...
start "React Frontend" cmd /k "cd /d frontend && npm run dev"

echo Waiting for React to build (5 seconds)...
timeout /t 5 /nobreak >nul

echo [3/3] Opening browser...
start http://localhost:5173

echo.
echo ========================================
echo  ALL SERVERS ARE RUNNING
echo  Go Backend  : http://localhost:8080
echo  React App   : http://localhost:5173
echo ========================================
echo.
echo (Close the terminal windows to stop the servers)

pause