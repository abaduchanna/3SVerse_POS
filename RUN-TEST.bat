@echo off
title 3S Verse POS - Test Run
color 0b
where node >nul 2>nul
if %errorlevel% neq 0 ( echo Node.js not installed. Get LTS from https://nodejs.org then run again. & pause & exit /b )
echo Installing components if needed...
call npm install
echo Launching 3S Verse POS...
call npm start
