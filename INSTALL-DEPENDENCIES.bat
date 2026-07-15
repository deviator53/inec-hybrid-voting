@echo off
echo ================================================
echo  INEC NEVS - Installing All Dependencies
echo  This may take 5-10 minutes...
echo ================================================
echo.

echo [1/4] Installing Blockchain Dependencies...
cd blockchain
call npm install
cd ..
echo ✓ Blockchain dependencies installed
echo.

echo [2/4] Installing Backend Dependencies...
cd backend
call npm install
cd ..
echo ✓ Backend dependencies installed
echo.

echo [3/4] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo ✓ Frontend dependencies installed
echo.

echo [4/4] Setting up Hardware Bridge Virtual Environment...
cd hardware-bridge
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..
echo ✓ Hardware bridge setup complete
echo.

echo ================================================
echo  Installation Complete!
echo ================================================
echo.
echo  Next Steps:
echo  1. Ensure MongoDB is running
echo  2. Run START-ALL-SERVICES.bat
echo  3. Open http://localhost:3000
echo.
echo  See DEPLOYMENT-GUIDE.md for detailed instructions.
echo.
pause
