import Path from 'path'
import fs from 'fs'
import { discover, DiscoveredBlock } from './discovery'
import { fileClosure } from './closure'

export interface AddBlockOptions {
  templateRoot: string
  targetRoot: string
  slug: string
}

export interface AddBlockResult {
  added: string[]
  skipped: string[]
  registered: boolean
  children: string[]
}

function relFromTemplate(templateRoot: string, abs: string): string {
  return Path.relative(templateRoot, abs)
}

function copyIfAbsent(
  templateRoot: string,
  targetRoot: string,
  absSrc: string,
  added: string[],
  skipped: string[],
) {
  const rel = relFromTemplate(templateRoot, absSrc)
  if (rel.startsWith('..')) return
  const dest = Path.join(targetRoot, rel)
  if (fs.existsSync(dest)) {
    skipped.push(rel)
    return
  }
  fs.mkdirSync(Path.dirname(dest), { recursive: true })
  fs.copyFileSync(absSrc, dest)
  added.push(rel)
}

function copyFolder(
  templateRoot: string,
  targetRoot: string,
  absDir: string,
  added: string[],
  skipped: string[],
) {
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const abs = Path.join(absDir, entry.name)
    if (entry.isDirectory()) copyFolder(templateRoot, targetRoot, abs, added, skipped)
    else if (entry.isFile()) copyIfAbsent(templateRoot, targetRoot, abs, added, skipped)
  }
}

// Insert a block into the target's exports.ts — mirrors the create:block splice in core.ts so the
// two "add a registration" paths behave identically (add the import + the array member, idempotent).
function registerInExports(exportsPath: string, exportConst: string, folder: string): boolean {
  if (!fs.existsSync(exportsPath)) return false
  const src = fs.readFileSync(exportsPath, 'utf8')
  const regex = /(blocks[\s\S]*?:[\s\S]*?\([\s\S]*?\[\s*)([\s\S]*?)(\s*\][\s\S]*?\))/
  const match = src.match(regex)
  if (!match) return false
  let [, prefix, existing, suffix] = match
  const importLine = `import { ${exportConst} } from './${folder}/config'\n`
  let out = src
  if (!existing.includes(exportConst)) {
    if (!existing.trim().endsWith(',')) existing += ','
    out = out.replace(regex, `${prefix}${existing}\n    ${exportConst},${suffix}`)
  }
  if (!out.includes(`from './${folder}/config'`)) out = importLine + out
  if (out === src) return true
  fs.writeFileSync(exportsPath, out, 'utf8')
  return true
}

export function addBlock(opts: AddBlockOptions): AddBlockResult {
  const { templateRoot, targetRoot, slug } = opts

  const template = discover(templateRoot)
  const block = template.blocks.find((b) => b.slug === slug)
  if (!block) {
    const names = template.blocks.map((b) => b.slug).sort().join(', ')
    throw new Error(`Block "${slug}" not found in the template. Available: ${names}`)
  }

  // Dependency guard: refuse if the block needs a collection/plugin the target does not have, rather
  // than silently leaving a dangling relationTo. Adding collections/plugins is out of scope here.
  const target = discover(targetRoot)
  const haveCollections = new Set(target.collections.map((c) => c.slug))
  // requiresPlugins holds npm package names; discovered plugins carry both slug and pkg.
  const havePlugins = new Set(target.plugins.map((p) => p.pkg))
  const missingCollections = (block.override.requiresCollections ?? []).filter(
    (c) => !haveCollections.has(c),
  )
  const missingPlugins = (block.override.requiresPlugins ?? []).filter((p) => !havePlugins.has(p))
  if (missingCollections.length || missingPlugins.length) {
    const parts: string[] = []
    if (missingCollections.length) parts.push(`collection(s): ${missingCollections.join(', ')}`)
    if (missingPlugins.length) parts.push(`plugin(s): ${missingPlugins.join(', ')}`)
    throw new Error(
      `Cannot add "${slug}" — this project is missing required ${parts.join(' and ')}. ` +
        `Add those first; adding collections/plugins is not yet supported by \`add:block\`.`,
    )
  }

  const added: string[] = []
  const skipped: string[] = []
  const children: string[] = []

  const toAdd: DiscoveredBlock[] = [block]
  for (const child of block.children) {
    const cb = template.blocks.find((b) => b.slug === child.slug)
    if (cb && cb.slug !== block.slug) {
      toAdd.push(cb)
      children.push(cb.slug)
    }
  }

  const blocksDir = Path.resolve(templateRoot, 'src/website/blocks')
  for (const b of toAdd) {
    // discovery yields a repo-relative configPath; fileClosure needs an absolute entry file.
    const configAbs = Path.resolve(templateRoot, b.configPath)
    const closure = fileClosure(templateRoot, [configAbs])
    for (const abs of closure) copyIfAbsent(templateRoot, targetRoot, abs, added, skipped)
    const folderDir = Path.join(blocksDir, b.folder)
    if (fs.existsSync(folderDir)) copyFolder(templateRoot, targetRoot, folderDir, added, skipped)
  }

  // Register only blocks that live in exports.ts (page-builder blocks). Inline-only / pure sub-blocks
  // are registered via their container's blocks array, which the copied config already carries.
  let registered = false
  const exportsPath = Path.resolve(targetRoot, 'src/website/blocks/exports.ts')
  for (const b of toAdd) {
    if (b.registeredIn !== 'exports') continue
    if (registerInExports(exportsPath, b.exportConst, b.folder)) registered = true
  }

  return { added, skipped, registered, children }
}
