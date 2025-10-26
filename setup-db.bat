@echo off
echo ========================================
echo   Aquila - Inicializacao do Banco
echo ========================================
echo.
echo Aguarde enquanto o banco e inicializado...
echo.

cd scripts
call npm install
echo.

echo Executando script de inicializacao...
echo.
call npm run init-db

echo.
echo ========================================
echo   Configuracao concluida!
echo ========================================
echo.
pause
