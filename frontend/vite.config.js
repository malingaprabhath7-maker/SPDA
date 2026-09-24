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
      php = spawn('php', ['-S', `localhost:${PHP_PORT}`, '-t', PROJECT_DIR], { cwd: PROJECT_DIR, stdio: 'ignore' })
      php.on('spawn', () => console.log(`  PHP API running on http://localhost:${PHP_PORT}`))
      php.on('error', () => console.warn('  PHP not found: install PHP (or XAMPP) so login and database features work.'))
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
