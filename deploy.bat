@echo off
echo ================================
echo Building oopsskin for cPanel...
echo ================================

REM Build the project
call npm run build

REM Copy .htaccess to out folder
copy public\.htaccess out\.htaccess

echo.
echo ================================
echo Build Complete!
echo ================================
echo.
echo Next Steps:
echo 1. Go to the 'out' folder
echo 2. Select all files and folders
echo 3. Upload to your cPanel public_html directory
echo 4. Make sure .htaccess is uploaded
echo.
echo Your site will be live at your domain!
echo ================================

pause
