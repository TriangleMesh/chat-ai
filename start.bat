@echo off
echo 🚀 Starting Chat AI Application...
echo.

echo 📦 Checking dependencies...
if not exist "server\node_modules" (
    echo ❌ Backend dependencies not installed, please run: cd server && npm install
    pause
    exit /b 1
)

if not exist "client\node_modules" (
    echo ❌ Frontend dependencies not installed, please run: cd client && npm install
    pause
    exit /b 1
)

if not exist "server\.env" (
    echo ❌ Missing server\.env file, please configure environment variables first
    pause
    exit /b 1
)

echo ✅ Dependencies check passed
echo.

echo 🔧 Starting backend server...
start "Chat AI Server" cmd /k "cd server && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo 🎨 Starting frontend application...
start "Chat AI Client" cmd /k "cd client && npm run dev"

echo.
echo 🎉 Application started successfully!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:3000
echo.
echo 💡 Closing this window will not stop services, press Ctrl+C in respective windows to stop
pause