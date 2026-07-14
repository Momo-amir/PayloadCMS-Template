#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
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

interface Args {
  target?: string
  templateRef: string
  templateRepo: string
  blocks?: string
  collections?: string
  skipInstall: boolean
  skipGit: boolean
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

  console.log(`\n${teal('create-kollab-payload')} ${dim(`v${SELF_VERSION}`)}`)

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
    // 2. Fetch the template quietly (feature menu is derived from its source, so we clone first).
    step(`Fetching template ${dim(args.templateRef)} …`)
    run(
      'git',
      [
        'clone',
        '--quiet',
        '--depth',
        '1',
        '--branch',
        args.templateRef,
        args.templateRepo,
        tmpClone,
      ],
      undefined,
      false,
    )
    step('Preparing the feature catalog …')
    run(yarnCmd, yarnArgs(['install', '--silent']), tmpClone, false)

    // 3. Selection screen — clearly framed so the choices stand out.
    if (interactive) {
      console.log(`\n${dim('─'.repeat(48))}`)
      banner('Choose the features to include')
      console.log(dim('  Everything is selected by default — deselect what you don’t need.\n'))
    }
    const genArgs = ['cli', 'generate', `--out=${targetDir}`, `--root=${tmpClone}`]
    if (args.blocks) genArgs.push(`--blocks=${args.blocks}`)
    if (args.collections) genArgs.push(`--collections=${args.collections}`)
    run(yarnCmd, yarnArgs(genArgs), tmpClone)
    if (interactive) console.log(dim('─'.repeat(48)))

    step('Finalizing project files …')
    cleanOutput(targetDir, projectName)
    setupEnv(targetDir)
  } finally {
    rm(tmpClone)
  }

  // 4. Install dependencies in the generated project (unless opted out).
  if (!args.skipInstall) {
    step('Installing dependencies …')
    run(yarnCmd, yarnArgs(['install']), targetDir)
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
  lines.push(
    `  ${teal('yarn generate:types')}   ${dim('# regenerate Payload types (needs the DB up)')}`,
  )
  lines.push(`  ${teal('yarn docker-dev')}        ${dim('# start Payload + Postgres on :8890')}`)
  lines.push(``)
  lines.push(dim(`  Remember to fill in .env before starting.`))
  lines.push(``)
  console.log(lines.join('\n'))
}

function cleanOutput(dir: string, projectName: string) {
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
  ]
  for (const rel of remove) rm(path.resolve(dir, rel))

  slimCoreTs(path.resolve(dir, '.cli/lib/core.ts'))
  resetPackageJson(path.resolve(dir, 'package.json'), projectName)
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
