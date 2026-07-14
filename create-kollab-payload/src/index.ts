#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'

const DEFAULT_TEMPLATE_REPO = 'https://github.com/Momo-amir/PayloadCMS-Template.git'

const SELF_VERSION = readSelfVersion()

interface Args {
  target?: string
  templateRef: string
  templateRepo: string
  blocks?: string
  collections?: string
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
  }
  for (const raw of argv) {
    if (raw.startsWith('--template-ref=')) args.templateRef = raw.slice('--template-ref='.length)
    else if (raw.startsWith('--template-repo='))
      args.templateRepo = raw.slice('--template-repo='.length)
    else if (raw.startsWith('--blocks=')) args.blocks = raw.slice('--blocks='.length)
    else if (raw.startsWith('--collections=')) args.collections = raw.slice('--collections='.length)
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

  let target = args.target
  if (!target) {
    const res = await prompts({
      type: 'text',
      name: 'target',
      message: 'Project directory',
      initial: 'my-kollab-site',
    })
    target = res.target
  }
  if (!target) fail('No target directory provided.')

  const targetDir = path.resolve(process.cwd(), target)
  const projectName = path.basename(targetDir)

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    fail(`Target directory is not empty: ${targetDir}`)
  }
  if (!has('git')) fail('git is required but was not found on PATH.')
  const yarnCmd = has('yarn') ? 'yarn' : has('corepack') ? 'corepack' : null
  if (!yarnCmd) fail('yarn (or corepack) is required but was not found on PATH.')
  const yarnArgs = (rest: string[]) => (yarnCmd === 'corepack' ? ['yarn', ...rest] : rest)

  const tmpClone = fs.mkdtempSync(path.join(os.tmpdir(), 'kollab-template-'))

  try {
    console.log(`\n▸ Cloning template ${args.templateRef} from ${args.templateRepo} …`)
    run('git', ['clone', '--depth', '1', '--branch', args.templateRef, args.templateRepo, tmpClone])

    console.log(`\n▸ Installing template engine dependencies …`)
    run(yarnCmd, yarnArgs(['install']), tmpClone)

    console.log(`\n▸ Generating site …`)
    const genArgs = ['cli', 'generate', `--out=${targetDir}`, `--root=${tmpClone}`]
    if (args.blocks) genArgs.push(`--blocks=${args.blocks}`)
    if (args.collections) genArgs.push(`--collections=${args.collections}`)
    run(yarnCmd, yarnArgs(genArgs), tmpClone)

    console.log(`\n▸ Cleaning generated project …`)
    cleanOutput(targetDir, projectName)

    console.log(`\n▸ Initializing git repository …`)
    run('git', ['init', '-q'], targetDir)
  } finally {
    rm(tmpClone)
  }

  console.log(
    `\n✔ Created ${projectName} at ${targetDir}\n\n` +
      `Next steps:\n` +
      `  cd ${target}\n` +
      `  yarn install\n` +
      `  yarn generate:types\n`,
  )
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
