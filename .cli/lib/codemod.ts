import { Project, SyntaxKind, SourceFile } from 'ts-morph'

/**
 * Remove a named symbol from every array literal in a source file, and remove its now-unused import.
 * Returns true if anything changed. Operates on an in-memory ts-morph SourceFile (caller saves).
 */
export function removeArrayMember(sf: SourceFile, symbol: string): boolean {
  let changed = false

  for (const arr of sf.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression)) {
    if (arr.wasForgotten()) continue
    const idx = arr.getElements().findIndex((e) => e.getText() === symbol)
    if (idx !== -1) {
      arr.removeElement(idx)
      changed = true
    }
  }

  // Remove the import if the symbol is no longer referenced anywhere in the file.
  const stillUsed = sf
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .some((id) => id.getText() === symbol && id.getParent()?.getKind() !== SyntaxKind.ImportSpecifier)
  if (!stillUsed) {
    for (const imp of sf.getImportDeclarations()) {
      const named = imp.getNamedImports().find((n) => n.getName() === symbol)
      if (named) {
        named.remove()
        changed = true
        if (imp.getNamedImports().length === 0 && !imp.getDefaultImport() && !imp.getNamespaceImport()) {
          imp.remove()
        }
      }
    }
  }
  return changed
}

/**
 * Remove a string literal (e.g. a collection slug) from every array literal in a file.
 * Used for plugin/search `collections: ['posts', ...]` lists. Returns true if anything changed.
 */
export function removeStringArrayMember(sf: SourceFile, value: string): boolean {
  let changed = false
  for (const arr of sf.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression)) {
    if (arr.wasForgotten()) continue
    const idx = arr
      .getElements()
      .findIndex(
        (e) => e.getKind() === SyntaxKind.StringLiteral && e.asKind(SyntaxKind.StringLiteral)!.getLiteralValue() === value,
      )
    if (idx !== -1) {
      arr.removeElement(idx)
      changed = true
    }
  }
  return changed
}

/**
 * Remove object-literal array members whose `value` property equals `value`, across the file.
 * Used to trim a collection from a block's config-driven list (e.g. ARCHIVE_COLLECTIONS).
 */
export function removeObjectArrayMemberByValue(sf: SourceFile, value: string): boolean {
  let changed = false
  for (const arr of sf.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression)) {
    if (arr.wasForgotten()) continue
    const els = arr.getElements()
    for (let i = els.length - 1; i >= 0; i--) {
      const obj = els[i].asKind(SyntaxKind.ObjectLiteralExpression)
      const val = obj
        ?.getProperty('value')
        ?.asKind(SyntaxKind.PropertyAssignment)
        ?.getInitializer()
        ?.asKind(SyntaxKind.StringLiteral)
        ?.getLiteralValue()
      if (val === value) {
        arr.removeElement(i)
        changed = true
      }
    }
  }
  return changed
}

/**
 * Remove Payload field object-literals whose `relationTo` equals `slug`, across the file. Handles a
 * bare string (`relationTo: 'people'`) — matching how the template declares single-target relations.
 * Whitespace-independent, so it never silently no-ops on reformatting the way a text patch would.
 * Returns true if anything changed.
 */
export function removeFieldByRelationTo(sf: SourceFile, slug: string): boolean {
  let changed = false
  for (const arr of sf.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression)) {
    if (arr.wasForgotten()) continue
    const els = arr.getElements()
    for (let i = els.length - 1; i >= 0; i--) {
      const obj = els[i].asKind(SyntaxKind.ObjectLiteralExpression)
      const rel = obj
        ?.getProperty('relationTo')
        ?.asKind(SyntaxKind.PropertyAssignment)
        ?.getInitializer()
        ?.asKind(SyntaxKind.StringLiteral)
        ?.getLiteralValue()
      if (rel === slug) {
        arr.removeElement(i)
        changed = true
      }
    }
  }
  return changed
}

/**
 * Remove object-literal properties whose key equals `name`, across the file (e.g. an entry in a
 * slug→component map like RenderHero's `heroes`). Then drop the now-unused import of the removed
 * initializer's symbol. Returns true if anything changed.
 */
export function removeObjectPropertyByName(sf: SourceFile, name: string): boolean {
  let changed = false
  const removedInitializers: string[] = []
  for (const obj of sf.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)) {
    if (obj.wasForgotten()) continue
    const prop = obj.getProperty(name)?.asKind(SyntaxKind.PropertyAssignment)
    if (prop) {
      const init = prop.getInitializer()?.getText()
      if (init) removedInitializers.push(init)
      prop.remove()
      changed = true
    }
  }
  for (const symbol of removedInitializers) {
    const stillUsed = sf
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .some((id) => id.getText() === symbol && id.getParent()?.getKind() !== SyntaxKind.ImportSpecifier)
    if (stillUsed) continue
    for (const imp of sf.getImportDeclarations()) {
      const named = imp.getNamedImports().find((n) => n.getName() === symbol)
      if (named) {
        named.remove()
        if (imp.getNamedImports().length === 0 && !imp.getDefaultImport() && !imp.getNamespaceImport()) {
          imp.remove()
        }
      }
    }
  }
  return changed
}

/**
 * Remove array elements that are a call to `callee` (e.g. `redirectsPlugin({...})` in a plugins
 * array), then drop the now-unused import of `callee` and any of `alsoRemoveImports` that are no
 * longer referenced. Returns true if an array element was removed.
 */
export function removeCallExpressionMember(
  sf: SourceFile,
  callee: string,
  alsoRemoveImports: string[] = [],
): boolean {
  let changed = false
  // Removing an outer array element forgets its descendant nodes (e.g. nested `features: [...]`
  // arrays inside a plugin config), so skip any array literal that a prior removal invalidated.
  for (const arr of sf.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression)) {
    if (arr.wasForgotten()) continue
    const els = arr.getElements()
    for (let i = els.length - 1; i >= 0; i--) {
      const call = els[i].asKind(SyntaxKind.CallExpression)
      if (call && call.getExpression().getText() === callee) {
        arr.removeElement(i)
        changed = true
      }
    }
  }
  if (!changed) return false
  const dropImportIfUnused = (symbol: string) => {
    const stillUsed = sf
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .some((id) => id.getText() === symbol && id.getParent()?.getKind() !== SyntaxKind.ImportSpecifier)
    if (stillUsed) return
    for (const imp of sf.getImportDeclarations()) {
      const named = imp.getNamedImports().find((n) => n.getName() === symbol)
      if (named) {
        named.remove()
        if (imp.getNamedImports().length === 0 && !imp.getDefaultImport() && !imp.getNamespaceImport()) {
          imp.remove()
        }
      }
    }
  }
  for (const s of [callee, ...alsoRemoveImports]) dropImportIfUnused(s)
  return changed
}

/**
 * Remove import declarations whose module specifier contains `needle` (e.g. a deleted block folder
 * path like `blocks/CallToAction/Component`). Returns true if anything was removed. Used to clean the
 * RichText hub's hardcoded imports of pruned inline-block components.
 */
export function removeImportByModuleContains(sf: SourceFile, needle: string): boolean {
  let changed = false
  for (const imp of sf.getImportDeclarations()) {
    if (imp.getModuleSpecifierValue().includes(needle)) {
      imp.remove()
      changed = true
    }
  }
  return changed
}

/**
 * Remove a named member from every union type in a source file (e.g. `Foo | Bar | Baz` -> `Foo | Baz`
 * when removing `Bar`). Used to clean the RichText hub's `NodeTypes` union, which references each
 * inline block's Props type independently of the value import removed by removeImportByModuleContains
 * — that import removal alone leaves the type reference dangling. Returns true if anything changed.
 */
export function removeUnionTypeMember(sf: SourceFile, typeName: string): boolean {
  let changed = false
  for (const union of sf.getDescendantsOfKind(SyntaxKind.UnionType)) {
    if (union.wasForgotten()) continue
    const members = union.getTypeNodes()
    const remaining = members.filter((m) => m.getText() !== typeName)
    if (remaining.length === members.length) continue
    // TS does not represent a single-member union as a UnionType node, so a union reduced to one
    // member here becomes a bare type reference next call — replace with `never` when the whole
    // union collapses to nothing so a lone final member (handled below) has something to land on.
    union.replaceWithText(remaining.length ? remaining.map((m) => m.getText()).join(' | ') : 'never')
    changed = true
  }

  // A union already reduced to its last member is a plain TypeReference, not a UnionType node (TS
  // doesn't wrap single-member unions) — the loop above never sees it. Replace that lone reference
  // with `never` directly wherever it appears as its own type-argument/annotation.
  for (const ref of sf.getDescendantsOfKind(SyntaxKind.TypeReference)) {
    if (ref.wasForgotten()) continue
    if (ref.getTypeName().getText() !== typeName) continue
    if (ref.getParent()?.getKind() === SyntaxKind.UnionType) continue
    ref.replaceWithText('never')
    changed = true
  }

  // Remove the (possibly aliased) type-only named import if no longer referenced anywhere.
  const stillUsed = sf
    .getDescendantsOfKind(SyntaxKind.TypeReference)
    .some((ref) => ref.getTypeName().getText() === typeName)
  if (!stillUsed) {
    for (const imp of sf.getImportDeclarations()) {
      const named = imp.getNamedImports().find((n) => (n.getAliasNode()?.getText() ?? n.getName()) === typeName)
      if (named) {
        named.remove()
        changed = true
        if (imp.getNamedImports().length === 0 && !imp.getDefaultImport() && !imp.getNamespaceImport()) {
          imp.remove()
        }
      }
    }
  }
  return changed
}

export interface PruneReport {
  file: string
  removedSymbols: string[]
}

/**
 * Apply a set of symbol removals across the given files. `edits` maps a repo-relative file path to the
 * list of symbols to remove from it. Uses one Project so cross-file state is consistent. Saves in place.
 */
export function applyRemovals(
  rootProject: Project,
  edits: { absPath: string; symbols: string[] }[],
): PruneReport[] {
  const reports: PruneReport[] = []
  for (const { absPath, symbols } of edits) {
    const sf = rootProject.addSourceFileAtPathIfExists(absPath)
    if (!sf) continue
    const removed: string[] = []
    for (const symbol of symbols) {
      if (removeArrayMember(sf, symbol)) removed.push(symbol)
    }
    if (removed.length) {
      sf.saveSync()
      reports.push({ file: absPath, removedSymbols: removed })
    }
  }
  return reports
}

/** Trim object-array members by `value` (collection slug) across files, e.g. ARCHIVE_COLLECTIONS. */
export function applyValueRemovals(
  rootProject: Project,
  edits: { absPath: string; values: string[] }[],
): PruneReport[] {
  const reports: PruneReport[] = []
  for (const { absPath, values } of edits) {
    const sf = rootProject.addSourceFileAtPathIfExists(absPath)
    if (!sf) continue
    const removed: string[] = []
    for (const value of values) {
      if (removeObjectArrayMemberByValue(sf, value)) removed.push(value)
    }
    if (removed.length) {
      sf.saveSync()
      reports.push({ file: absPath, removedSymbols: removed })
    }
  }
  return reports
}

/** Remove string-literal array members (collection slugs) across files. */
export function applyStringRemovals(
  rootProject: Project,
  edits: { absPath: string; values: string[] }[],
): PruneReport[] {
  const reports: PruneReport[] = []
  for (const { absPath, values } of edits) {
    const sf = rootProject.addSourceFileAtPathIfExists(absPath)
    if (!sf) continue
    const removed: string[] = []
    for (const value of values) {
      if (removeStringArrayMember(sf, value)) removed.push(value)
    }
    if (removed.length) {
      sf.saveSync()
      reports.push({ file: absPath, removedSymbols: removed })
    }
  }
  return reports
}

/** Remove object-literal properties by key (e.g. entries in a slug→component map), across files. */
export function applyObjectPropertyRemovals(
  rootProject: Project,
  edits: { absPath: string; names: string[] }[],
): PruneReport[] {
  const reports: PruneReport[] = []
  for (const { absPath, names } of edits) {
    const sf = rootProject.addSourceFileAtPathIfExists(absPath)
    if (!sf) continue
    const removed: string[] = []
    for (const name of names) {
      if (removeObjectPropertyByName(sf, name)) removed.push(name)
    }
    if (removed.length) {
      sf.saveSync()
      reports.push({ file: absPath, removedSymbols: removed })
    }
  }
  return reports
}

/** Remove Payload relationship field objects by their `relationTo` slug, across files. */
export function applyFieldRelationRemovals(
  rootProject: Project,
  edits: { absPath: string; slugs: string[] }[],
): PruneReport[] {
  const reports: PruneReport[] = []
  for (const { absPath, slugs } of edits) {
    const sf = rootProject.addSourceFileAtPathIfExists(absPath)
    if (!sf) continue
    const removed: string[] = []
    for (const slug of slugs) {
      if (removeFieldByRelationTo(sf, slug)) removed.push(slug)
    }
    if (removed.length) {
      sf.saveSync()
      reports.push({ file: absPath, removedSymbols: removed })
    }
  }
  return reports
}

export function makeProject(root: string, tsConfigPath: string): Project {
  return new Project({
    tsConfigFilePath: tsConfigPath,
    skipAddingFilesFromTsConfig: true,
  })
}
