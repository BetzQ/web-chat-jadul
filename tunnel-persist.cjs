const { spawn } = require('child_process')
const fs = require('fs')
console.log('[PERSIST] Menjalankan tunnel tanpa kill...')
const tunnel = spawn('node', ['node_modules/localtunnel/bin/lt.js', '--port', '5173'], { detached: true, stdio: 'inherit' })
tunnel.stdout.on('data', (d) => {
  const s = d.toString()
  const lines = s.split(/\r?\n/)
  for (const line of lines) {
    if (line.includes('https://') || line.includes('http://')) {
      const url = line.trim()
      const httpUrl = url.replace('https://', 'http://')
      console.log('===== URL TEROWONGAN (HTTP) =====')
      console.log(httpUrl)
      console.log('===== BUKA DI HP SAMSUNG GALAXY V =====')
      fs.writeFileSync('tunnel-url.txt', httpUrl)
    }
  }
})
