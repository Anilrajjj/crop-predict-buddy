@echo off
echo Starting Agricultural ML Model Training...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

echo Python found, starting training...
echo.

REM Install requirements and train models
python train_models.py

echo.
echo Training complete! Starting API server...
echo.

REM Start the Flask API
python flask_api.py

pause

