@echo off
title Quinton - github.com/William5553/quinton
echo Starting..

:main
node --trace-warnings -r dotenv/config index.js
echo Restarting in 5 seconds...
timeout /t 5 /nobreak
goto main