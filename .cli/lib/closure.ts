import Path from 'path'
import fs from 'fs'
import { Project, SourceFile } from 'ts-morph'

const IGNORE_LEAVES = ['payload-types.ts']

function resolveAlias(root: string, spec: string, fromFile: string): string[] {
  let base: string | null = null
  if (spec.startsWith('@site/')) base = Path.resolve(root, 'src/website', spec.slice('@site/'.length))
  else if (spec.startsWith('@/cms/')) base = Path.resolve(root, 'src/cms', spec.slice('@/cms/'.length))
  else if (spec.startsWith('@public/')) return []
  else if (spec === '@payload-config') base = Path.resolve(root, 'src/payload.config.ts')
  else if (spec === '@/payload-types') return []
  else if (spec.startsWith('@/')) base = Path.resolve(root, 'src', spec.slice('@/'.length))
  else if (spec.startsWith('.')) base = Path.resolve(Path.dirname(fromFile), spec)
  else return [] // bare package

  if (!base) return []
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    Path.join(base, 'index.ts'),
    Path.join(base, 'index.tsx'),
  ]
  const hit = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile())
  return hit ? [hit] : []
}

/**
 * Compute the transitive file closure of an entry file, following static imports.
 * Stops at node_modules and generated leaves.
 */
export function fileClosure(root: string, entryFiles: string[], project?: Project): Set<string> {
  const proj =
    project ??
    new Project({
      tsConfigFilePath: Path.resolve(root, 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    })
  const seen = new Set<string>()
  const queue = [...entryFiles]

  while (queue.length) {
    const file = queue.shift()!
    if (seen.has(file)) continue
    if (IGNORE_LEAVES.some((l) => file.endsWith(l))) continue
    if (!fs.existsSync(file)) continue
    seen.add(file)

    let sf: SourceFile
    try {
      sf = proj.addSourceFileAtPathIfExists(file) ?? proj.getSourceFileOrThrow(file)
    } catch {
      continue
    }
    const specs = [
      ...sf.getImportDeclarations().map((d) => d.getModuleSpecifierValue()),
      ...sf.getExportDeclarations().map((d) => d.getModuleSpecifierValue()).filter((s): s is string => !!s),
    ]
    for (const spec of specs) {
      for (const resolved of resolveAlias(root, spec, file)) {
        if (!seen.has(resolved)) queue.push(resolved)
      }
    }
  }
  return seen
}

/**
 * Given all block folders and the set of KEPT block folders, return absolute file paths that are
 * owned by a DESELECTED block and are NOT in the closure of any kept block → safe to prune.
 */
export function prunableBlockFiles(
  root: string,
  allBlockFolders: string[],
  keptEntryFiles: string[],
): string[] {
  const keepClosure = fileClosure(root, keptEntryFiles)
  const blocksDir = Path.resolve(root, 'src/website/blocks')
  const keptFolders = new Set<string>()
  for (const f of keepClosure) {
    if (f.startsWith(blocksDir + Path.sep)) {
      const rel = Path.relative(blocksDir, f)
      keptFolders.add(rel.split(Path.sep)[0])
    }
  }
  const prunable: string[] = []
  for (const folder of allBlockFolders) {
    if (keptFolders.has(folder)) continue
    const dir = Path.join(blocksDir, folder)
    if (fs.existsSync(dir)) prunable.push(dir)
  }
  return prunable
}
