@echo off
echo [AUTO] Memulai tunnel + git workflow...
start "TunnelBG" /min node tunnel-and-push.cjs
echo [AUTO] Proses berjalan di background (cek tunnel-url.txt & console)
