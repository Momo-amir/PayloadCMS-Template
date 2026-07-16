#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'

const DEFAULT_TEMPLATE_REPO = 'https://github.com/Momo-amir/PayloadCMS-Template.git'

const SELF_VERSION = readSelfVersion()

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code: string) => (s: string) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s)
const teal = paint('36;1')
const green = paint('32;1')
const dim = paint('2')
const bold = paint('1')

function banner(msg: string) {
  console.log(`\n${teal('◆')} ${bold(msg)}`)
}

function step(msg: string) {
  console.log(`\n${teal('▸')} ${msg}`)
}

// The Kollab wordmark (public/assets/ascii.txt), inlined so it ships in the published package.
const KOLLAB_ART = [
  '↑↑↑       ↑↑↑↑    ↑↑↑↑↑↑↑↑↑↑↑      ↑↑↑↑          ↑↑↑↑                ↑↑↑↑↑        ↑↑↑↑↑↑↑↑↑↑↑↑↑',
  '↑↑↑     ↑↑↑↑↑   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑    ↑↑↑↑          ↑↑↑↑                ↑↑↑↑↑↑       ↑↑↑↑↑↑↑↑↑↑↑↑↑↑',
  '↑↑↑   ↑↑↑↑↑    ↑↑↑↑↑       ↑↑↑↑↑   ↑↑↑↑          ↑↑↑↑               ↑↑↑↑↑↑↑↑      ↑↑↑↑       ↑↑↑↑',
  '↑↑↑ ↑↑↑↑↑      ↑↑↑↑          ↑↑↑↑  ↑↑↑↑          ↑↑↑↑              ↑↑↑↑  ↑↑↑↑     ↑↑↑↑↑↑↑↑↑↑↑↑↑↑',
  '               ↑↑↑↑          ↑↑↑↑  ↑↑↑↑          ↑↑↑↑             ↑↑↑↑   ↑↑↑↑     ↑↑↑↑↑↑↑↑↑↑↑↑↑↑',
  '↑↑↑↑↑↑↑↑↑↑↑    ↑↑↑↑          ↑↑↑↑  ↑↑↑↑          ↑↑↑↑            ↑↑↑↑↑↑↑↑↑↑↑↑↑    ↑↑↑↑      ↑↑↑↑↑',
  '↑↑↑↑   ↑↑↑↑↑   ↑↑↑↑↑       ↑↑↑↑↑   ↑↑↑↑          ↑↑↑↑           ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑   ↑↑↑↑       ↑↑↑↑',
  '↑↑↑     ↑↑↑↑↑↑  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑    ↑↑↑↑↑↑↑↑↑↑↑↑↑ ↑↑↑↑↑↑↑↑↑↑↑↑↑  ↑↑↑↑        ↑↑↑↑  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑',
  '↑↑↑       ↑↑↑↑↑   ↑↑↑↑↑↑↑↑↑↑↑      ↑↑↑↑↑↑↑↑↑↑↑↑↑ ↑↑↑↑↑↑↑↑↑↑↑↑↑ ↑↑↑↑         ↑↑↑↑↑ ↑↑↑↑↑↑↑↑↑↑↑↑↑↑',
]

function printBanner() {
  const cols = process.stdout.columns || 80
  console.log('')
  if (cols >= 96) {
    for (const line of KOLLAB_ART) console.log(teal(line))
  } else {
    // Terminal too narrow for the wordmark — fall back to a simple title line.
    console.log(teal('KOLLAB'))
  }
  console.log(`\n${bold('create-kollab-payload')} ${dim(`v${SELF_VERSION}`)}`)
  console.log('')
}

interface Args {
  target?: string
  templateRef: string
  templateRepo: string
  blocks?: string
  collections?: string
  heros?: string
  plugins?: string
  brand?: string
  skipInstall: boolean
  skipGit: boolean
}

function titleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function readSelfVersion(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const pkg = JSON.parse(fs.readFileSync(path.resolve(here, '../package.json'), 'utf8'))
  return String(pkg.version)
}

// Locate the bundled engine + the initializer's own tsx binary. The engine ships inside this
// package (engine/) with ts-morph/prompts as real deps, so it runs from here against a template
// clone via --root — no install in the clone is needed to build the catalog or prune.
function packageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
}

function engineEntry(): string {
  const entry = path.resolve(packageRoot(), 'engine/lib/core.ts')
  if (!fs.existsSync(entry)) {
    fail(`bundled engine not found at ${entry} — the package build did not run \`bundle-engine\`.`)
  }
  return entry
}

// Resolve tsx's CLI script via Node's own module resolution, which finds it wherever the installer
// placed it — nested under this package (local install) OR hoisted to a top-level node_modules
// (npm/npx dedupe). We then run it with `node <script>` rather than a .bin symlink, so no assumption
// about where .bin lives. Falls back to the nested .bin path if resolution somehow fails.
function tsxScript(): string {
  const require = createRequire(import.meta.url)
  try {
    const pkgJson = require.resolve('tsx/package.json')
    const pkgDir = path.dirname(pkgJson)
    const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8'))
    const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.tsx
    if (binRel) {
      const bin = path.resolve(pkgDir, binRel)
      if (fs.existsSync(bin)) return bin
    }
  } catch {
    // fall through to the .bin lookup below
  }
  const binName = process.platform === 'win32' ? 'tsx.cmd' : 'tsx'
  for (const dir of [
    path.resolve(packageRoot(), 'node_modules/.bin'),
    path.resolve(packageRoot(), '../.bin'),
  ]) {
    const bin = path.resolve(dir, binName)
    if (fs.existsSync(bin)) return bin
  }
  fail('tsx could not be resolved — reinstall create-kollab-payload.')
}

// Run the bundled engine (engine/lib/core.ts) with the given engine args. tsx's resolved entry is a
// node-runnable script when found via package.json (run it with `node`); the .bin fallback is a
// shell shim (run it directly). Either way the engine args follow.
function runEngine(engineArgs: string[], cwd?: string) {
  const tsx = tsxScript()
  const runnableWithNode = /\.(mjs|cjs|js)$/.test(tsx)
  const cmd = runnableWithNode ? process.execPath : tsx
  const args = runnableWithNode
    ? [tsx, engineEntry(), ...engineArgs]
    : [engineEntry(), ...engineArgs]
  run(cmd, args, cwd)
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    templateRef: `v${SELF_VERSION}`,
    templateRepo: DEFAULT_TEMPLATE_REPO,
    skipInstall: false,
    skipGit: false,
  }
  for (const raw of argv) {
    if (raw.startsWith('--template-ref=')) args.templateRef = raw.slice('--template-ref='.length)
    else if (raw.startsWith('--template-repo='))
      args.templateRepo = raw.slice('--template-repo='.length)
    else if (raw.startsWith('--blocks=')) args.blocks = raw.slice('--blocks='.length)
    else if (raw.startsWith('--collections=')) args.collections = raw.slice('--collections='.length)
    else if (raw.startsWith('--heros=')) args.heros = raw.slice('--heros='.length)
    else if (raw.startsWith('--plugins=')) args.plugins = raw.slice('--plugins='.length)
    else if (raw.startsWith('--brand=')) args.brand = raw.slice('--brand='.length)
    else if (raw === '--skip-install') args.skipInstall = true
    else if (raw === '--skip-git') args.skipGit = true
    else if (!raw.startsWith('--') && !args.target) args.target = raw
  }
  return args
}

function run(cmd: string, cmdArgs: string[], cwd?: string, inheritStdio = true) {
  const res = spawnSync(cmd, cmdArgs, {
    cwd,
    stdio: inheritStdio ? 'inherit' : 'pipe',
    encoding: 'utf8',
  })
  if (res.status !== 0) {
    const detail = inheritStdio ? '' : `\n${res.stderr || res.stdout || ''}`
    fail(`\`${cmd} ${cmdArgs.join(' ')}\` failed (exit ${res.status}).${detail}`)
  }
  return res
}

const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

// Run a command with an animated spinner + elapsed timer for long, output-less steps (clone/install).
// Captures output so the spinner line stays clean; prints captured stderr/stdout on failure.
async function runSpinner(
  label: string,
  cmd: string,
  cmdArgs: string[],
  cwd?: string,
): Promise<void> {
  const tty = process.stdout.isTTY && !process.env.NO_COLOR
  if (!tty) {
    step(`${label} …`)
    run(cmd, cmdArgs, cwd, false)
    return
  }
  const start = process.hrtime.bigint()
  let frame = 0
  const render = () => {
    const secs = Number((process.hrtime.bigint() - start) / 1_000_000_000n)
    process.stdout.write(`\r${teal(SPINNER[frame % SPINNER.length])} ${label} ${dim(`${secs}s`)}  `)
    frame++
  }
  render()
  const timer = setInterval(render, 80)
  let out = ''
  await new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, { cwd })
    child.stdout?.on('data', (d) => (out += d))
    child.stderr?.on('data', (d) => (out += d))
    child.on('error', reject)
    child.on('close', (code) => {
      clearInterval(timer)
      const secs = Number((process.hrtime.bigint() - start) / 1_000_000_000n)
      if (code === 0) {
        process.stdout.write(`\r${green('✔')} ${label} ${dim(`${secs}s`)}      \n`)
        resolve()
      } else {
        process.stdout.write(`\r${teal('✖')} ${label}\n`)
        fail(`\`${cmd} ${cmdArgs.join(' ')}\` failed (exit ${code}).\n${out}`)
      }
    })
  })
}

function has(cmd: string): boolean {
  const probe = process.platform === 'win32' ? 'where' : 'which'
  return spawnSync(probe, [cmd], { stdio: 'ignore' }).status === 0
}

function fail(msg: string): never {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

type PM = 'corepack' | 'yarn' | 'npm'

// Resolve the package manager for the output install. The generated project is yarn-based
// (yarn.lock, scripts, Docker all assume yarn), so prefer yarn — via corepack first, which honors
// the template's pinned `packageManager` and works even when the host's global yarn is the wrong
// major or absent. npm is accepted as a last resort so the initializer still runs without yarn;
// we warn afterwards that day-to-day commands expect yarn.
function resolvePackageManager(): PM {
  if (has('corepack')) return 'corepack'
  if (has('yarn')) return 'yarn'
  if (has('npm')) return 'npm'
  fail('a package manager is required: none of corepack, yarn, or npm was found on PATH.')
}

// The install invocation for a PM, run in the output project. corepack shells out to yarn.
function installInvocation(pm: PM): { cmd: string; args: string[] } {
  if (pm === 'corepack') return { cmd: 'corepack', args: ['yarn', 'install'] }
  if (pm === 'yarn') return { cmd: 'yarn', args: ['install'] }
  return { cmd: 'npm', args: ['install'] }
}

function rm(target: string) {
  fs.rmSync(target, { recursive: true, force: true })
}

// `create-kollab-payload add [blockSlug]` — pull a block (and its file closure) from the template
// into an existing project. With a slug, adds that block directly; with no slug, opens an interactive
// picker of addable blocks. Clones the template (no install), runs the bundled engine against the
// current project, then reminds about type/importmap regeneration.
async function addFeature(argv: string[]) {
  const slug = argv.find((a) => !a.startsWith('--'))

  const templateRef =
    argv.find((a) => a.startsWith('--template-ref='))?.slice('--template-ref='.length) ??
    `v${SELF_VERSION}`
  const templateRepo =
    argv.find((a) => a.startsWith('--template-repo='))?.slice('--template-repo='.length) ??
    DEFAULT_TEMPLATE_REPO

  const targetDir = process.cwd()
  if (!fs.existsSync(path.resolve(targetDir, 'src/website/blocks/exports.ts'))) {
    fail('Run this from the root of a Kollab project (no src/website/blocks/exports.ts here).')
  }
  if (!has('git')) fail('git is required but was not found on PATH.')

  printBanner()
  const tmpClone = fs.mkdtempSync(path.join(os.tmpdir(), 'kollab-template-'))
  try {
    await runSpinner(`Fetching template ${templateRef}`, 'git', [
      'clone',
      '--quiet',
      '--depth',
      '1',
      '--branch',
      templateRef,
      templateRepo,
      tmpClone,
    ])
    const engineArgs = slug
      ? ['add:block', slug, `--root=${tmpClone}`, `--target=${targetDir}`]
      : ['add', `--root=${tmpClone}`, `--target=${targetDir}`]
    runEngine(engineArgs)
  } finally {
    rm(tmpClone)
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  printBanner()

  // 1. Project name first (create-next-app style) — before any cloning.
  let target = args.target
  if (!target) {
    const res = await prompts({
      type: 'text',
      name: 'target',
      message: 'What is your project named?',
      initial: 'my-kollab-site',
    })
    target = res.target
  }
  if (!target) fail('No project name provided.')

  const targetDir = path.resolve(process.cwd(), target)
  const projectName = path.basename(targetDir)

  // 1b. Brand/site name — used for the site title, OG/meta, SEO. Defaults to the project name.
  let brand = args.brand
  if (brand === undefined && !args.blocks) {
    const res = await prompts({
      type: 'text',
      name: 'brand',
      message: 'Site / brand name',
      initial: titleCase(projectName),
    })
    brand = res.brand
  }
  brand = (brand && brand.trim()) || titleCase(projectName)

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    fail(`Target directory is not empty: ${targetDir}`)
  }
  if (!has('git')) fail('git is required but was not found on PATH.')
  const pm = args.skipInstall ? null : resolvePackageManager()
  const interactive = !args.blocks

  const tmpClone = fs.mkdtempSync(path.join(os.tmpdir(), 'kollab-template-'))

  try {
    // 2. Fetch the template (feature menu is derived from its source, so we clone first). No install
    //    in the clone — the pruning engine is bundled in this package and runs against --root.
    await runSpinner(`Fetching template ${args.templateRef}`, 'git', [
      'clone',
      '--quiet',
      '--depth',
      '1',
      '--branch',
      args.templateRef,
      args.templateRepo,
      tmpClone,
    ])

    // 3. Selection screen — clearly framed so the choices stand out.
    if (interactive) {
      console.log(`\n${dim('─'.repeat(48))}`)
      banner('Choose the features to include')
      console.log(dim('  Everything is selected by default — deselect what you don’t need.\n'))
    }
    const genArgs = ['generate', `--out=${targetDir}`, `--root=${tmpClone}`]
    if (args.blocks) genArgs.push(`--blocks=${args.blocks}`)
    if (args.collections) genArgs.push(`--collections=${args.collections}`)
    if (args.heros) genArgs.push(`--heros=${args.heros}`)
    if (args.plugins) genArgs.push(`--plugins=${args.plugins}`)
    runEngine(genArgs, tmpClone)
    if (interactive) console.log(dim('─'.repeat(48)))

    step('Finalizing project files …')
    cleanOutput(targetDir, projectName, brand)
    setupEnv(targetDir)
  } finally {
    rm(tmpClone)
  }

  // 4. Install dependencies in the generated project (unless opted out). This is the single install
  //    of the run — a cold install against the pruned package.json + shipped yarn.lock.
  if (pm) {
    const { cmd, args: installArgs } = installInvocation(pm)
    await runSpinner('Installing dependencies (Payload + Next)', cmd, installArgs, targetDir)
    if (pm === 'npm') {
      console.log(
        dim(
          "  Installed with npm. This project's scripts and Docker setup expect yarn —\n" +
            '  install it (`corepack enable` or `npm i -g yarn`) before `yarn docker-dev`.',
        ),
      )
    }
  }

  // 5. Initialize git with a single initial commit (so it isn't a pile of untracked files).
  if (!args.skipGit) {
    step('Initializing git repository …')
    run('git', ['init', '-q'], targetDir)
    run('git', ['add', '-A'], targetDir, false)
    commitInitial(targetDir)
  }

  printDone(projectName, target, args)
}

function setupEnv(dir: string) {
  const example = path.resolve(dir, '.env.example')
  const env = path.resolve(dir, '.env')
  if (fs.existsSync(example) && !fs.existsSync(env)) {
    fs.copyFileSync(example, env)
    console.log(dim(`  Copied .env.example → .env — fill in your values before running.`))
  }
}

function commitInitial(dir: string) {
  const res = spawnSync(
    'git',
    [
      '-c',
      'user.name=create-kollab-payload',
      '-c',
      'user.email=noreply@kollab.dk',
      'commit',
      '-q',
      '-m',
      'Initial commit from create-kollab-payload',
    ],
    { cwd: dir, stdio: 'pipe', encoding: 'utf8' },
  )
  if (res.status !== 0) {
    console.log(dim('  Skipped initial commit (configure git user and commit manually).'))
  }
}

function printDone(projectName: string, target: string, args: Args) {
  const lines = [
    ``,
    `${green('✔')} ${bold(`Created ${projectName}`)}`,
    ``,
    `${bold('Next steps:')}`,
    `  ${teal(`cd ${target}`)}`,
  ]
  if (args.skipInstall) lines.push(`  ${teal('yarn install')}`)
  lines.push(`  ${teal('yarn docker-dev')}          ${dim('# start Payload + Postgres on :8890')}`)
  lines.push(`  ${teal('yarn generate:types')}      ${dim('# regenerate Payload types')}`)
  lines.push(
    `  ${teal('yarn generate:importmap')}  ${dim('# rebuild the admin import map for your feature set')}`,
  )
  lines.push(``)
  lines.push(dim(`  Fill in .env first. generate:* need the DB (docker-dev) running.`))
  lines.push(``)
  console.log(lines.join('\n'))
}

function cleanOutput(dir: string, projectName: string, brand: string) {
  const remove = [
    '.cli/lib/discovery.ts',
    '.cli/lib/closure.ts',
    '.cli/lib/codemod.ts',
    '.cli/lib/add.ts',
    '.cli/lib/generate.ts',
    '.cli/lib/select.ts',
    '.cli/NEXT_SESSION_PROMPT.md',
    'features',
    'docs/DISTRIBUTION.md',
    '.claude/skills/generate-site',
    '.claude/skills/author-feature',
    '.claude/agents/feature-manifest-author.md',
    'create-kollab-payload',
    '.create-kollab-payload',
    // Release automation is template-only: a client site must not publish create-kollab-payload.
    '.github/workflows/release.yml',
  ]
  for (const rel of remove) rm(path.resolve(dir, rel))

  pruneTemplateOnlyPipeline(path.resolve(dir, 'bitbucket-pipelines.yml'))
  applyBrand(dir, brand)
  slimCoreTs(path.resolve(dir, '.cli/lib/core.ts'))
  resetPackageJson(path.resolve(dir, 'package.json'), projectName)
}

// Strip fenced `template-only` steps from the copied bitbucket-pipelines.yml. The GitHub-mirror step
// only makes sense in the Kollab template repo; a generated client site keeps just its deploy step.
function pruneTemplateOnlyPipeline(file: string) {
  if (!fs.existsSync(file)) return
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  const out: string[] = []
  let skipping = false
  let removed = false
  for (const line of lines) {
    if (/# >>> template-only:/.test(line)) {
      skipping = true
      removed = true
      continue
    }
    if (/# <<< template-only:/.test(line)) {
      skipping = false
      continue
    }
    if (!skipping) out.push(line)
  }
  if (removed) {
    fs.writeFileSync(file, out.join('\n'))
    console.log(dim('  Removed template-only CI steps from bitbucket-pipelines.yml.'))
  }
}

// Replace the template's default brand string in the generated project. These are the only files
// carrying the literal (og/meta/seo/seed); kept as an explicit list so the rename is auditable.
function applyBrand(dir: string, brand: string) {
  if (brand === 'Kollab Website Template') return
  const files = [
    'src/cms/utilities/mergeOpenGraph.ts',
    'src/cms/utilities/generateMeta.ts',
    'src/cms/plugins/index.ts',
    'src/cms/endpoints/seed/home-static.tsx',
  ]
  let touched = 0
  for (const rel of files) {
    const abs = path.resolve(dir, rel)
    if (!fs.existsSync(abs)) continue
    const src = fs.readFileSync(abs, 'utf8')
    if (!src.includes('Kollab Website Template')) continue
    fs.writeFileSync(abs, src.split('Kollab Website Template').join(brand))
    touched++
  }
  if (touched) console.log(dim(`  Set brand name to “${brand}” in ${touched} file(s).`))
}

function slimCoreTs(file: string) {
  if (!fs.existsSync(file)) return
  const src = fs.readFileSync(file, 'utf8')

  const header = [
    'import Path from "path";',
    'import fs from "fs";',
    'import os from "os";',
    'import Command from "./Command";',
    '',
    'interface Config {',
    '  blockDirectory: string;',
    '}',
    '',
    'const dirname = import.meta.dirname;',
    '',
    'const rootFlag = process.argv.find((a) => a.startsWith("--root="))?.slice("--root=".length);',
    'const root = rootFlag ? Path.resolve(rootFlag) : Path.resolve(dirname, "../../");',
    'const winPrefix = (os.platform() == "win32" ? "file://" : "");',
    'const configPath = winPrefix + Path.resolve(root, ".cli/config.json");',
    'const config: Config = await import(configPath);',
    'const exportsPath = Path.resolve(root, config.blockDirectory, "exports.ts");',
    '',
  ].join('\n')

  const createBlock = extractBlock(src, 'Command.register(\n  new Command("create:block")')
  if (!createBlock) {
    fail('Could not slim core.ts — create:block registration not found. Template layout changed?')
  }

  const dispatch = [
    '',
    '// Execute command from process arguments',
    'const rawArgs = process.argv.slice(2).filter((a) => !a.startsWith("--root="));',
    '',
    'if (rawArgs.length < 1) {',
    '  console.error("No command provided");',
    '  Command.executeFromString("help");',
    '  process.exit(0);',
    '} else {',
    '  Command.executeFromString(rawArgs.join(" "));',
    '}',
  ].join('\n')

  fs.writeFileSync(file, `${header}\n${createBlock}\n${dispatch}\n`)
}

function extractBlock(src: string, startMarker: string): string | null {
  const start = src.indexOf(startMarker)
  if (start === -1) return null
  let depth = 0
  let i = src.indexOf('(', start)
  const open = i
  for (; i < src.length; i++) {
    const ch = src[i]
    if (ch === '(') depth++
    else if (ch === ')') {
      depth--
      if (depth === 0) {
        const end = src.indexOf(';', i)
        return src.slice(start, end === -1 ? i + 1 : end + 1)
      }
    }
  }
  void open
  return null
}

function resetPackageJson(file: string, projectName: string) {
  if (!fs.existsSync(file)) return
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
  pkg.name = projectName
  pkg.version = '0.1.0'
  if (pkg.devDependencies) delete pkg.devDependencies['ts-morph']
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`)
}

const argv = process.argv.slice(2)
const entry = argv[0] === 'add' ? addFeature(argv.slice(1)) : main()
entry.catch((err) => fail(err instanceof Error ? err.message : String(err)))
