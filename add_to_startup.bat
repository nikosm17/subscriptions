@echo off
:: Define paths and names
set "APP_PATH=%~dp0app.exe"
set "SHORTCUT_NAME=AppShortcut"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

:: Optional: wait for system to stabilize after boot
timeout /t 10 >nul

:: Create shortcut using PowerShell
powershell -Command ^
"$s = (New-Object -COM WScript.Shell).CreateShortcut('%STARTUP_FOLDER%\%SHORTCUT_NAME%.lnk'); ^
$s.TargetPath = '%APP_PATH%'; ^
$s.WorkingDirectory = '%~dp0'; ^
$s.WindowStyle = 1; ^
$s.Save()"

echo Shortcut created in Startup folder.
pause
