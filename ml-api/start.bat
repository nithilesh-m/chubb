@echo off
echo Starting Flask ML API...
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
call venv\Scripts\activate

REM Check if requirements are installed
pip show flask >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

REM Check if model file exists
if not exist "car_damage_classification_model.h5" (
    echo.
    echo ⚠️  WARNING: Model file not found!
    echo Please place car_damage_classification_model.h5 in this directory
    echo The API will use mock predictions until the model is available
    echo.
)

REM Start Flask app
echo Starting Flask API on http://localhost:5001
echo.
python app.py
