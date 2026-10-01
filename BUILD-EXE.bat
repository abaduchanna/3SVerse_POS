@echo off
title 3S Verse POS - Build the .exe
color 0a
echo ============================================================
echo          3S Verse POS System  -  Building Windows .exe
echo ============================================================
echo.
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo  [X] Node.js is NOT installed.
  echo.
  echo  Do this once:
  echo    1. Open https://nodejs.org
  echo    2. Download the "LTS" version and install it (Next, Next, Finish)
  echo    3. Close this window and double-click BUILD-EXE.bat again
  echo.
  pause
  exit /b
)
echo  [1/3] Installing components (first time takes a few minutes)...
call npm install
if %errorlevel% neq 0 ( echo  [X] Install failed. Check your internet. & pause & exit /b )
echo.
echo  [2/3] Protecting source code (compiling to V8 bytecode)...
call node protect.js prepare
if %errorlevel% neq 0 ( echo  [X] Protect step failed. & pause & exit /b )
set ELECTRON_RUN_AS_NODE=1
call npx electron compile.js
set ELECTRON_RUN_AS_NODE=
if %errorlevel% neq 0 ( echo  [X] Bytecode compile failed. & pause & exit /b )
call node protect.js finish
if %errorlevel% neq 0 ( echo  [X] Protect step failed. & pause & exit /b )
echo.
echo  [3/3] Building the .exe ...
call npm run dist
if %errorlevel% neq 0 ( echo  [X] Build failed. & pause & exit /b )
echo.
echo ============================================================
echo   DONE! Your installer is in the "dist" folder:
echo     - 3SVerse-POS-Setup-1.0.0.exe       (installer)
echo     - 3SVerse-POS-Portable-1.0.0.exe    (no install needed)
echo   Source code is protected: the app ships as V8 bytecode only.
echo ============================================================
explorer dist
pause
