@echo off
REM Silent background starter: Vite dev server + LocalTunnel HTTP
start "ServerBG" /min cmd /c "npm run dev > server.log 2>&1"
REM Wait briefly for server to bind
ping -n 3 127.0.0.1 >nul
start "TunnelBG" /min cmd /c "node node_modules\\localtunnel\\bin\\lt.js --port 5173 > tunnel-output.txt 2>&1"
echo [AUTO] Server (5173) dan tunnel lokal mulai background.
echo [INFO] Cek tunnel-output.txt untuk URL http:// setelah 10 detik.
