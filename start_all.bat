@echo off
echo ===================================================
echo     VERIDEX AI — Identity Screening Prototype
echo ===================================================
echo Starting Backend on http://localhost:8000 ...
start "VERIDEX Backend" cmd /k "%~dp0start_backend.bat"

echo Starting Frontend on http://localhost:5173 ...
start "VERIDEX Frontend" cmd /k "%~dp0start_frontend.bat"

echo.
echo Both services launched!
echo Open your browser to: http://localhost:5173
echo Swagger API docs at: http://localhost:8000/docs
echo ===================================================
