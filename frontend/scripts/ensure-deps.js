import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = dirname(__dirname)
const vitePackageJson = join(projectRoot, 'node_modules', 'vite', 'package.json')

if (!existsSync(vitePackageJson)) {
  console.log('Installing frontend dependencies...')
  execSync('npm install', { cwd: projectRoot, stdio: 'inherit' })
} else {
  console.log('Frontend dependencies already installed.')
}
