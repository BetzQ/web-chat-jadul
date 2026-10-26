const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('[TUNNEL] Menjalankan lokal tunnel port 5173...')

const tunnel = spawn('node', ['node_modules\\localtunnel\\bin\\lt.js', '--port', '5173'], {
  detached: true,
  stdio: ['ignore', 'pipe', 'pipe']
})

tunnel.stdout.on('data', (data) => {
  const str = data.toString()
  const lines = str.split(/\r?\n/)
  for (const line of lines) {
    if (line.includes('https://') || line.includes('http://')) {
      const url = line.trim()
      const httpUrl = url.replace('https://', 'http://')
      console.log('\n===== URL TEROWONGAN (HTTP) =====')
      console.log(httpUrl)
      console.log('===== SALIN KE BROWSER HP SAMSUNG GALAXY V =====\n')
      fs.writeFileSync(path.join(__dirname, 'tunnel-url.txt'), httpUrl)
      runGit()
      tunnel.kill()
    }
  }
})

tunnel.stderr.on('data', (data) => {
  // suppress noise
})

tunnel.on('error', (e) => console.error('[TUNNEL ERROR]', e.message))

function runGit() {
  console.log('[GIT] Menjalankan workflow commit & push ke betzq...')
  const cmds = [
    'git config user.name "betzq"',
    'git config user.email "x9xnobx.19@gmail.com"',
    'git add .',
    'git commit -m "fix: optimize performance for legacy device, add 4-button selector, and implement lightweight gallery upload to public supabase storage"',
    'git push origin main'
  ]
  for (const cmd of cmds) {
    try {
      const out = require('child_process').execSync(cmd, { stdio: 'inherit', cwd: __dirname })
    } catch (e) {
      console.error('[GIT ERROR]', cmd)
    }
  }
  console.log('[DONE] Semua proses selesai.')
}

// Fallback after 30s if no URL captured
setTimeout(() => {
  console.log('[TUNNEL] URL belum tertangkap, periksa terminal lokal. File tunnel-url.txt jika ada.')
}, 30000)
