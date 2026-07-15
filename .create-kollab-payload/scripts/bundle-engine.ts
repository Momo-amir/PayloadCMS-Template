import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const pkgRoot = path.resolve(here, '..')
const cliRoot = path.resolve(pkgRoot, '../.cli')
const engineOut = path.resolve(pkgRoot, 'engine')

const LIB_FILES = [
  'core.ts',
  'Command.ts',
  'discovery.ts',
  'closure.ts',
  'codemod.ts',
  'add.ts',
  'generate.ts',
  'select.ts',
]

function fail(msg: string): never {
  console.error(`bundle-engine: ${msg}`)
  process.exit(1)
}

if (!fs.existsSync(cliRoot)) {
  fail(`engine source not found at ${cliRoot} — run this from the template repo (.create-kollab-payload).`)
}

fs.rmSync(engineOut, { recursive: true, force: true })
fs.mkdirSync(path.join(engineOut, 'lib'), { recursive: true })

for (const rel of LIB_FILES) {
  const src = path.join(cliRoot, 'lib', rel)
  if (!fs.existsSync(src)) fail(`missing engine file: ${src}`)
  fs.copyFileSync(src, path.join(engineOut, 'lib', rel))
}

fs.copyFileSync(path.join(cliRoot, 'config.json'), path.join(engineOut, 'config.json'))

console.log(`bundle-engine: copied ${LIB_FILES.length} engine files + config.json → engine/`)
