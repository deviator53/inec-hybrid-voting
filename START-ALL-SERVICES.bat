@echo off
echo ================================================
echo  INEC NEVS - Starting All Services
echo  Academic Thesis Implementation
echo ================================================
echo.

echo [1/5] Starting MongoDB...
start "MongoDB" cmd /k "echo MongoDB should be running as a service. If not, run 'mongod' manually."

timeout /t 2

echo [2/5] Starting Blockchain Node (Hardhat)...
cd blockchain
start "Blockchain Node" cmd /k "npx hardhat node"
cd ..

timeout /t 5

echo [3/5] Deploying Smart Contract...
cd blockchain
start "Contract Deployment" cmd /k "timeout /t 8 && npx hardhat run scripts/deploy.ts --network localhost && echo Contract deployed! && timeout /t 5"
cd ..

timeout /t 12

echo [4/5] Starting Backend API (Port 5000)...
cd backend
start "Backend API" cmd /k "npm run dev"
cd ..

timeout /t 3

echo [5/5] Starting Hardware Bridge (Port 5050)...
cd hardware-bridge
start "Hardware Bridge" cmd /k "venv\Scripts\activate && python app.py"
cd ..

timeout /t 3

echo [6/6] Starting Frontend (Port 3000)...
cd frontend
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ================================================
echo  All services started!
echo ================================================
echo.
echo  Access Points:
echo  - Frontend:        http://localhost:3000
echo  - Backend API:     http://localhost:5000
echo  - Hardware Bridge: http://localhost:5050
echo  - Blockchain RPC:  http://localhost:8545
echo.
echo  Press any key to close this window...
pause >nul
