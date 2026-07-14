import Path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import { Project } from 'ts-morph'
import { discover, DiscoveredBlock } from './discovery'
import { fileClosure } from './closure'
import { applyRemovals, applyStringRemovals, applyValueRemovals } from './codemod'

export interface GenerateOptions {
  root: string
  outDir: string
  keepBlockSlugs: string[] // slugs the user chose to KEEP
  keepCollectionSlugs?: string[] // optional-collection slugs to KEEP; undefined = keep all
  dryRun: boolean
}

export interface ContainerChildEdit {
  containerConfig: string // repo-relative container config.ts
  removeSymbols: string[] // child export-const symbols to remove from the container's blocks arrays
  removeChildSlugs: string[]
}

export interface CollectionPrune {
  slug: string
  symbol: string
  folderOrFile: string // repo-relative path to remove
  configImportRemoval: string // symbol to remove from payload.config.ts collections + import
  stringListEdits: { file: string; value: string }[] // plugin/search collections: ['x'] removals
  ownedFiles: string[] // collection-owned app files/routes to delete
  patches: { file: string; find: string; replace: string }[] // shared-file find/replace edits
  conflicts: string[] // kept block slugs that require this collection (needs confirm)
}

export interface RelationTrimEdit {
  blockConfig: string // repo-relative block config to trim
  removeCollectionSlugs: string[]
}

export interface GeneratePlan {
  keptBlocks: string[]
  prunedBlocks: string[]
  prunedFolders: string[] // repo-relative
  registrationEdits: { file: string; symbols: string[] }[]
  containerChildEdits: ContainerChildEdit[]
  prunedCollections: CollectionPrune[]
  relationTrimEdits: RelationTrimEdit[]
  warnings: string[]
}

/**
 * Resolve which blocks survive: a block is kept if selected, OR it is a dependency of a kept block
 * (import-closure handles this at the file level), OR it is a required sub-block. Prerequisites on
 * collections/plugins are surfaced as warnings for the caller to act on.
 */
function planPrune(root: string, keepSlugs: Set<string>, keepCollectionSlugs?: string[]): GeneratePlan {
  const d = discover(root)
  const warnings: string[] = []

  // onlyInside sub-blocks survive iff their parent survives.
  for (const b of d.blocks) {
    if (b.override.onlyInside && keepSlugs.has(b.override.onlyInside)) keepSlugs.add(b.slug)
  }

  const bySlug = new Map(d.blocks.map((b) => [b.slug, b]))

  // Collections the caller chose to prune (undefined keepCollectionSlugs = keep all). Computed up
  // front so a block whose required collections are ALL pruned can itself be pruned below.
  const willPruneCollSlugs = new Set<string>()
  if (keepCollectionSlugs) {
    const keepColl = new Set(keepCollectionSlugs)
    for (const coll of d.collections) {
      if (!coll.core && !keepColl.has(coll.slug)) willPruneCollSlugs.add(coll.slug)
    }
  }

  // A block whose ENTIRE requiresCollections set is being pruned is meaningless on its own (e.g.
  // peopleArchiveBlock without the people collection) — prune it too. A block that still has at
  // least one required collection surviving is kept and its dangling relationTo is trimmed below.
  const forcePrune = new Set<string>()
  for (const b of d.blocks) {
    const reqs = b.override.requiresCollections ?? []
    if (reqs.length > 0 && reqs.every((s) => willPruneCollSlugs.has(s))) {
      keepSlugs.delete(b.slug)
      forcePrune.add(b.slug)
    }
  }

  // Survival graph: a block survives if selected OR pulled in by a surviving block through a
  // NON-container dependency. Container→child edges are prunable (deselecting a child removes it
  // from the container), so they do NOT force survival.
  const survives = new Set(keepSlugs)
  // Sub-blocks (onlyInside) survive iff their parent survives AND they are selected — otherwise the
  // container-child rule prunes them. We treat them like any other child below.
  const containerChildSlugs = new Set(d.blocks.flatMap((b) => b.children.map((c) => c.slug)))

  // Non-container survival closure via the file import graph, but excluding container child folders
  // that were not selected. We seed from surviving block configs and walk imports; any block folder
  // reached that is a container-child-only and unselected is later pruned from the container instead.
  const blocksDir = Path.resolve(root, 'src/website/blocks')
  const closure = fileClosure(
    root,
    [...survives].map((s) => Path.resolve(root, bySlug.get(s)!.configPath)),
  )
  for (const f of closure) {
    if (f.startsWith(blocksDir + Path.sep)) {
      const folder = Path.relative(blocksDir, f).split(Path.sep)[0]
      const blk = d.blocks.find((b) => b.folder === folder)
      // A block reached purely as a container child (and not selected) must NOT auto-survive.
      if (blk && !survives.has(blk.slug) && containerChildSlugs.has(blk.slug)) continue
      // A block force-pruned because all its required collections are gone must not be revived.
      if (blk && forcePrune.has(blk.slug)) continue
      if (blk) survives.add(blk.slug)
    }
  }

  const kept = d.blocks.filter((b) => survives.has(b.slug))
  const pruned = d.blocks.filter((b) => !survives.has(b.slug))

  // Prerequisite warnings for kept blocks.
  const keptCollectionSlugs = new Set([...d.collections.map((c) => c.slug), ...d.pluginCollections])
  for (const b of kept) {
    for (const need of b.override.requiresCollections ?? []) {
      if (!keptCollectionSlugs.has(need)) {
        warnings.push(`Block "${b.slug}" needs collection "${need}" — ensure it stays registered.`)
      }
    }
    for (const plugin of b.override.requiresPlugins ?? []) {
      warnings.push(`Block "${b.slug}" needs plugin "${plugin}" — keep it in package.json + plugins.`)
    }
  }

  // Container child edits: for each KEPT container, remove children that did not survive.
  const containerChildEdits: ContainerChildEdit[] = []
  for (const c of kept) {
    if (c.children.length === 0) continue
    const removeChildren = c.children.filter((ch) => !survives.has(ch.slug))
    if (removeChildren.length === 0) continue
    containerChildEdits.push({
      containerConfig: c.configPath,
      removeSymbols: removeChildren.map((ch) => ch.symbol),
      removeChildSlugs: removeChildren.map((ch) => ch.slug),
    })
    if (removeChildren.length === c.children.length) {
      warnings.push(`Container "${c.slug}" kept with an empty blocks list — add project-specific children.`)
    }
  }

  // Registration edits: remove each pruned block's export symbol from exports.ts / BlocksFeature files.
  const editsByFile = new Map<string, Set<string>>()
  const addEdit = (absFile: string, symbol: string) => {
    if (!editsByFile.has(absFile)) editsByFile.set(absFile, new Set())
    editsByFile.get(absFile)!.add(symbol)
  }
  const exportsFile = Path.resolve(root, 'src/website/blocks/exports.ts')
  const postsFile = Path.resolve(root, 'src/cms/collections/Posts/index.ts')
  for (const b of pruned) {
    if (b.registeredIn === 'exports') addEdit(exportsFile, b.exportConst)
    else addEdit(postsFile, b.exportConst)
  }

  // Collection prune: only OPTIONAL (non-core) collections may be pruned. undefined keepCollections
  // means keep everything.
  const prunedCollections: CollectionPrune[] = []
  if (keepCollectionSlugs) {
    const keepColl = new Set(keepCollectionSlugs)
    const stringListFiles = [
      'src/cms/plugins/index.ts',
      'src/cms/search/beforeSync.ts',
      'src/website/layout/search/beforeSync.ts',
      'src/website/layout/heros/config.ts',
    ].map((p) => Path.resolve(root, p))

    for (const coll of d.collections) {
      if (coll.core || keepColl.has(coll.slug)) continue
      // conflicts: kept blocks that require this collection.
      const conflicts = kept
        .filter((b) => (b.override.requiresCollections ?? []).includes(coll.slug))
        .map((b) => b.slug)

      const folderOrFile = collectionPath(root, coll.importPath)
      const stringListEdits = stringListFiles
        .filter((f) => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(`'${coll.slug}'`))
        .map((f) => ({ file: Path.relative(root, f), value: coll.slug }))

      prunedCollections.push({
        slug: coll.slug,
        symbol: coll.symbol,
        folderOrFile: folderOrFile ? Path.relative(root, folderOrFile) : '',
        configImportRemoval: coll.symbol,
        stringListEdits,
        ownedFiles: coll.ownedFiles,
        patches: coll.patches,
        conflicts,
      })
      if (conflicts.length) {
        warnings.push(
          `Collection "${coll.slug}" is required by kept block(s): ${conflicts.join(', ')}. ` +
            `Their relationTo will dangle — rewire manually.`,
        )
      }
    }
  }

  // relationTo trims: for each KEPT block that requires a PRUNED collection, trim that collection
  // from the block's config-driven list so it still compiles (block stays, collection gone).
  const prunedCollSlugs = new Set(prunedCollections.map((c) => c.slug))
  const relationTrimEdits: RelationTrimEdit[] = []
  for (const b of kept) {
    const trims = (b.override.requiresCollections ?? []).filter((s) => prunedCollSlugs.has(s))
    if (trims.length) relationTrimEdits.push({ blockConfig: b.configPath, removeCollectionSlugs: trims })
  }

  return {
    keptBlocks: kept.map((b) => b.slug),
    prunedBlocks: pruned.map((b) => b.slug),
    prunedFolders: pruned.map((b) => Path.relative(root, Path.join(blocksDir, b.folder))),
    registrationEdits: [...editsByFile].map(([file, symbols]) => ({
      file: Path.relative(root, file),
      symbols: [...symbols],
    })),
    containerChildEdits,
    prunedCollections,
    relationTrimEdits,
    warnings,
  }
}

/** Resolve a collection's source path (folder with index.ts, or a single .ts file) from its import. */
function collectionPath(root: string, importPath: string): string | null {
  if (!importPath) return null
  const base = importPath.startsWith('./')
    ? Path.resolve(root, 'src', importPath.slice(2))
    : Path.resolve(root, 'src', importPath.replace(/^\.\//, ''))
  const candidates = [`${base}.ts`, Path.join(base, 'index.ts'), base]
  const hit = candidates.find((c) => fs.existsSync(c))
  if (!hit) return null
  // If it's an index.ts inside a dedicated folder, remove the whole folder.
  if (hit.endsWith(`${Path.sep}index.ts`)) return Path.dirname(hit)
  return hit
}

function copyTree(root: string, outDir: string) {
  fs.mkdirSync(outDir, { recursive: true })
  // Use git to copy only tracked + untracked-but-not-ignored files.
  const files = execSync('git ls-files --cached --others --exclude-standard', {
    cwd: root,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
  for (const rel of files) {
    const src = Path.join(root, rel)
    const dest = Path.join(outDir, rel)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(Path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
  }
}

export function generate(opts: GenerateOptions): GeneratePlan {
  const keepSlugs = new Set(opts.keepBlockSlugs)
  const plan = planPrune(opts.root, keepSlugs, opts.keepCollectionSlugs)

  if (opts.dryRun) return plan

  // 1. Copy the template into the output dir.
  copyTree(opts.root, opts.outDir)

  // 2. Physically remove pruned block folders in the OUTPUT.
  for (const rel of plan.prunedFolders) {
    fs.rmSync(Path.join(opts.outDir, rel), { recursive: true, force: true })
  }

  // 3. Apply registration removals to the OUTPUT copy via ts-morph.
  const outProject = new Project({
    tsConfigFilePath: Path.resolve(opts.outDir, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  })
  applyRemovals(
    outProject,
    plan.registrationEdits.map((e) => ({
      absPath: Path.resolve(opts.outDir, e.file),
      symbols: e.symbols,
    })),
  )

  // 4. Remove deselected children from KEPT container configs (renderer is data-driven, so it follows).
  applyRemovals(
    outProject,
    plan.containerChildEdits.map((e) => ({
      absPath: Path.resolve(opts.outDir, e.containerConfig),
      symbols: e.removeSymbols,
    })),
  )

  // 5. Deep collection prune: remove folder/file, remove from payload.config collections + import,
  //    remove from plugin/search string lists.
  if (plan.prunedCollections.length) {
    for (const c of plan.prunedCollections) {
      if (c.folderOrFile) fs.rmSync(Path.resolve(opts.outDir, c.folderOrFile), { recursive: true, force: true })
      for (const owned of c.ownedFiles) {
        fs.rmSync(Path.resolve(opts.outDir, owned), { recursive: true, force: true })
      }
    }
    applyRemovals(outProject, [
      {
        absPath: Path.resolve(opts.outDir, 'src/payload.config.ts'),
        symbols: plan.prunedCollections.map((c) => c.configImportRemoval),
      },
    ])
    const stringEdits = new Map<string, string[]>()
    for (const c of plan.prunedCollections) {
      for (const e of c.stringListEdits) {
        const key = e.file
        if (!stringEdits.has(key)) stringEdits.set(key, [])
        stringEdits.get(key)!.push(e.value)
      }
    }
    applyStringRemovals(
      outProject,
      [...stringEdits].map(([file, values]) => ({ absPath: Path.resolve(opts.outDir, file), values })),
    )
    // Drop now-unused collection symbol imports (e.g. `import { People }`) from the string-list files.
    const prunedSymbols = plan.prunedCollections.map((c) => c.symbol)
    applyRemovals(
      outProject,
      [...stringEdits.keys()].map((file) => ({ absPath: Path.resolve(opts.outDir, file), symbols: prunedSymbols })),
    )
  }

  // 5b. Apply per-collection shared-file patches (find/replace) for pruned collections.
  for (const c of plan.prunedCollections) {
    for (const patch of c.patches) {
      const abs = Path.resolve(opts.outDir, patch.file)
      if (!fs.existsSync(abs)) continue
      const text = fs.readFileSync(abs, 'utf8')
      if (text.includes(patch.find)) {
        fs.writeFileSync(abs, text.split(patch.find).join(patch.replace))
      }
    }
  }

  // 6. Trim pruned collections from kept blocks' config-driven relationTo lists (keeps them compiling).
  if (plan.relationTrimEdits.length) {
    applyValueRemovals(
      outProject,
      plan.relationTrimEdits.map((e) => ({
        absPath: Path.resolve(opts.outDir, e.blockConfig),
        values: e.removeCollectionSlugs,
      })),
    )
  }

  return plan
}
