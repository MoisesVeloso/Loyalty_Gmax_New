@echo off
REM ================================
REM Start React frontend
REM ================================
cd /d "C:\Loyalty Program Application"
start "" "C:\Program Files\nodejs\npm.cmd" run dev -- --host

REM ================================
REM Start Node backend
REM ================================
cd /d "C:\Loyalty Program Application\backend"
start "" "C:\Program Files\nodejs\node.exe" index.js


@echo off
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME% set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
start "" %CHROME% --incognito http://localhost:5173/