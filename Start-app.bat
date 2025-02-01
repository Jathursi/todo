@echo off

REM Change directory to the location of your React app
cd "C:\Users\ACER\Desktop\my web\my-todo"

REM Start XAMPP control panel
start "" "C:\xampp\xampp-control.exe"

REM Start Apache using the XAMPP control script
start "" "C:\xampp\apache_start.bat"

REM Start MySQL using the XAMPP control script
start "" "C:\xampp\mysql_start.bat"

REM Start phpMyAdmin (adjust the path if necessary)
start "" "http://localhost/phpmyadmin/index.php"

REM Change directory to the frontend directory
cd frontend

REM Start frontend React app on port 3000
start cmd /k npm start -- --port 3000

REM Change directory to the backend directory
cd ../backend

REM Start backend server using nodemon (assuming server.js is your entry point)
start cmd /k npm start

exit
