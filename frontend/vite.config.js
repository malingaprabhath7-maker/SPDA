import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const FRONTEND_DIR = fileURLToPath(new URL('.', import.meta.url))
const PROJECT_DIR = resolve(FRONTEND_DIR, '..')   // SPDA_web (auth/, applications/, database.php)
const PHP_PORT = 8000

// `npm run dev` eken PHP server ekath automatically start karanawa (terminal ekak athi)
function phpServer() {
  let php = null
  return {
    name: 'spda-php-server',
    configureServer() {
      php = spawn('php', ['-S', `localhost:${PHP_PORT}`, '-t', PROJECT_DIR], { cwd: PROJECT_DIR, stdio: ['ignore', 'ignore', 'pipe'] })
      let phpErrors = ''
      php.stderr.on('data', chunk => { phpErrors += chunk })
      php.on('spawn', () => console.log(`  PHP API starting on http://localhost:${PHP_PORT}`))
      php.on('error', () => console.warn('  PHP not found: install PHP (or XAMPP) so login and database features work.'))
      php.on('exit', code => {
        if (code === null || code === 0) return
        console.warn(`\n  PHP server stopped (code ${code}).`)
        if (/Failed to listen|in use/i.test(phpErrors)) {
          console.warn(`  Port ${PHP_PORT} is already used by an OLD PHP server (it may be using old settings).`)
          console.warn('  Fix: run  taskkill /F /IM php.exe  in a terminal, then run npm run dev again.\n')
        } else if (phpErrors.trim()) {
          console.warn('  ' + phpErrors.trim().split('\n').slice(0, 3).join('\n  ') + '\n')
        }
      })
      const stop = () => { if (php && !php.killed) php.kill() }
      process.on('exit', stop)
      process.on('SIGINT', () => { stop(); process.exit() })
      process.on('SIGTERM', () => { stop(); process.exit() })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    phpServer(),
  ],
  server: {
    // React eken '/api/...' kiyana requests PHP server ekata yawanawa
    proxy: {
      '/api': {
        target: `http://localhost:${PHP_PORT}`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(FRONTEND_DIR, 'index.html'),         // welcome page
        dashboard: resolve(FRONTEND_DIR, 'dashboard.html'), // React dashboard
        login: resolve(FRONTEND_DIR, 'login.html'),         // login / register
      },
    },
  },
})
