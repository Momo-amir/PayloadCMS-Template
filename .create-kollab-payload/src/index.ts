#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process'
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

// The Kollab "K" mark (from the brand favicon) rendered in block characters, shown top-left of the
// intro next to the tool name + version. Mark rows are padded to a fixed visible width BEFORE
// coloring so ANSI codes don't throw off alignment.
const KOLLAB_MARK = ['█  ╱', '█ ╱ ', '██  ', '█ ╲ ', '█  ╲']

function printBanner() {
  const right = ['', bold('create-kollab-payload'), dim(`v${SELF_VERSION}`), '', '']
  console.log('')
  for (let i = 0; i < KOLLAB_MARK.length; i++) {
    console.log(`  ${teal(KOLLAB_MARK[i])}   ${right[i] ?? ''}`)
  }
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

function rm(target: string) {
  fs.rmSync(target, { recursive: true, force: true })
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
  const yarnCmd = has('yarn') ? 'yarn' : has('corepack') ? 'corepack' : null
  if (!yarnCmd) fail('yarn (or corepack) is required but was not found on PATH.')
  const yarnArgs = (rest: string[]) => (yarnCmd === 'corepack' ? ['yarn', ...rest] : rest)
  const interactive = !args.blocks

  const tmpClone = fs.mkdtempSync(path.join(os.tmpdir(), 'kollab-template-'))

  try {
    // 2. Fetch the template (feature menu is derived from its source, so we clone first).
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
    await runSpinner(
      'Preparing the feature catalog',
      yarnCmd,
      yarnArgs(['install', '--silent']),
      tmpClone,
    )

    // 3. Selection screen — clearly framed so the choices stand out.
    if (interactive) {
      console.log(`\n${dim('─'.repeat(48))}`)
      banner('Choose the features to include')
      console.log(dim('  Everything is selected by default — deselect what you don’t need.\n'))
    }
    const genArgs = ['cli', 'generate', `--out=${targetDir}`, `--root=${tmpClone}`]
    if (args.blocks) genArgs.push(`--blocks=${args.blocks}`)
    if (args.collections) genArgs.push(`--collections=${args.collections}`)
    if (args.heros) genArgs.push(`--heros=${args.heros}`)
    if (args.plugins) genArgs.push(`--plugins=${args.plugins}`)
    run(yarnCmd, yarnArgs(genArgs), tmpClone)
    if (interactive) console.log(dim('─'.repeat(48)))

    step('Finalizing project files …')
    cleanOutput(targetDir, projectName, brand)
    setupEnv(targetDir)

    // Reuse the clone's node_modules for the generated project: the output's deps are a subset of
    // the template's, and yarn.lock ships with the copy, so a follow-up install just reconciles
    // (prunes the few removed packages) instead of re-downloading the whole Payload+Next tree.
    if (!args.skipInstall) {
      reuseNodeModules(path.join(tmpClone, 'node_modules'), path.join(targetDir, 'node_modules'))
    }
  } finally {
    rm(tmpClone)
  }

  // 4. Install dependencies in the generated project (unless opted out). With node_modules reused
  //    above, this reconciles against the pruned package.json rather than doing a cold install.
  if (!args.skipInstall) {
    await runSpinner('Installing dependencies', yarnCmd, yarnArgs(['install']), targetDir)
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

// Move the clone's node_modules into the generated project (rename is instant on the same volume;
// fall back to a recursive copy across devices). Best-effort: on any failure the follow-up
// `yarn install` still produces a correct tree, just slower.
function reuseNodeModules(from: string, to: string) {
  if (!fs.existsSync(from) || fs.existsSync(to)) return
  try {
    fs.renameSync(from, to)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'EXDEV') {
      try {
        fs.cpSync(from, to, { recursive: true })
      } catch {
        rm(to)
      }
    }
  }
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
  lines.push(
    `  ${teal('yarn generate:types')}   ${dim('# regenerate Payload types (needs the DB up)')}`,
  )
  lines.push(`  ${teal('yarn docker-dev')}        ${dim('# start Payload + Postgres on :8890')}`)
  lines.push(``)
  lines.push(dim(`  Remember to fill in .env before starting.`))
  lines.push(``)
  console.log(lines.join('\n'))
}

function cleanOutput(dir: string, projectName: string, brand: string) {
  const remove = [
    '.cli/lib/discovery.ts',
    '.cli/lib/closure.ts',
    '.cli/lib/codemod.ts',
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
  ]
  for (const rel of remove) rm(path.resolve(dir, rel))

  applyBrand(dir, brand)
  slimCoreTs(path.resolve(dir, '.cli/lib/core.ts'))
  resetPackageJson(path.resolve(dir, 'package.json'), projectName)
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

main().catch((err) => fail(err instanceof Error ? err.message : String(err)))
